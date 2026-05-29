from fastapi import APIRouter, HTTPException
from bson import ObjectId
from database import patients_collection
from models import PatientCreate, PatientUpdate, PatientResponse
from services.ai_service import generate_health_remarks
import traceback

router = APIRouter()

def patient_serializer(patient) -> dict:
    return {
        "id": str(patient["_id"]),
        "full_name": patient["full_name"],
        "date_of_birth": str(patient["date_of_birth"]),
        "email": patient["email"],
        "glucose": patient["glucose"],
        "haemoglobin": patient["haemoglobin"],
        "cholesterol": patient["cholesterol"],
        "remarks": patient.get("remarks", ""),
    }

@router.post("/patients", response_model=PatientResponse)
async def create_patient(patient: PatientCreate):
    try:
        remarks = generate_health_remarks(
            patient.full_name, str(patient.date_of_birth),
            patient.glucose, patient.haemoglobin, patient.cholesterol
        )
        patient_dict = patient.model_dump()
        patient_dict["date_of_birth"] = str(patient.date_of_birth)
        patient_dict["remarks"] = remarks
        result = await patients_collection.insert_one(patient_dict)
        new_patient = await patients_collection.find_one({"_id": result.inserted_id})
        return patient_serializer(new_patient)
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/patients")
async def get_all_patients():
    try:
        patients = []
        async for p in patients_collection.find():
            patients.append(patient_serializer(p))
        return patients
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/patients/{patient_id}")
async def get_patient(patient_id: str):
    patient = await patients_collection.find_one({"_id": ObjectId(patient_id)})
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return patient_serializer(patient)

@router.put("/patients/{patient_id}")
async def update_patient(patient_id: str, updated: PatientUpdate):
    update_data = {k: v for k, v in updated.model_dump().items() if v is not None}
    if "date_of_birth" in update_data:
        update_data["date_of_birth"] = str(update_data["date_of_birth"])
    existing = await patients_collection.find_one({"_id": ObjectId(patient_id)})
    if not existing:
        raise HTTPException(status_code=404, detail="Patient not found")
    merged = {**existing, **update_data}
    update_data["remarks"] = generate_health_remarks(
        merged["full_name"], merged["date_of_birth"],
        merged["glucose"], merged["haemoglobin"], merged["cholesterol"]
    )
    await patients_collection.update_one(
        {"_id": ObjectId(patient_id)}, {"$set": update_data}
    )
    updated_patient = await patients_collection.find_one({"_id": ObjectId(patient_id)})
    return patient_serializer(updated_patient)

@router.delete("/patients/{patient_id}")
async def delete_patient(patient_id: str):
    result = await patients_collection.delete_one({"_id": ObjectId(patient_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Patient not found")
    return {"message": "Patient deleted successfully"}
