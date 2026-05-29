from pydantic import BaseModel, EmailStr, field_validator
from typing import Optional
from datetime import date

class PatientCreate(BaseModel):
    full_name: str
    date_of_birth: date
    email: EmailStr
    glucose: float
    haemoglobin: float
    cholesterol: float

    @field_validator("date_of_birth")
    @classmethod
    def dob_not_future(cls, v):
        if v > date.today():
            raise ValueError("Date of birth cannot be in the future")
        return v

    @field_validator("glucose", "haemoglobin", "cholesterol")
    @classmethod
    def must_be_positive(cls, v):
        if v <= 0:
            raise ValueError("Blood test values must be positive numbers")
        return v

class PatientUpdate(BaseModel):
    full_name: Optional[str] = None
    date_of_birth: Optional[date] = None
    email: Optional[EmailStr] = None
    glucose: Optional[float] = None
    haemoglobin: Optional[float] = None
    cholesterol: Optional[float] = None

class PatientResponse(BaseModel):
    id: str
    full_name: str
    date_of_birth: str
    email: str
    glucose: float
    haemoglobin: float
    cholesterol: float
    remarks: Optional[str] = None