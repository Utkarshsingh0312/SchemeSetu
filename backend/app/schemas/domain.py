from pydantic import BaseModel, EmailStr
from typing import Optional, List, Any
import datetime

# --- AUTH SCHEMAS ---
class UserRegister(BaseModel):
    name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: "UserOut"

class UserOut(BaseModel):
    id: int
    name: str
    email: str
    is_admin: bool
    created_at: datetime.datetime

    class Config:
        from_attributes = True

# --- PROFILE SCHEMAS ---
class ProfileSchema(BaseModel):
    age: int = 25
    gender: str = "Any"
    state: str = "All India"
    district: Optional[str] = ""
    annual_income: float = 200000.0
    occupation: str = "Other"
    employment_status: str = "Employed"
    category: str = "General"
    disability_status: bool = False
    marital_status: str = "Single"
    
    student: bool = False
    farmer: bool = False
    bpl: bool = False
    senior_citizen: bool = False
    widow: bool = False
    pregnant: bool = False
    rural_resident: bool = False
    entrepreneur: bool = False

    class Config:
        from_attributes = True

# --- SCHEME SCHEMAS ---
class SchemeCreate(BaseModel):
    name: str
    short_name: Optional[str] = None
    short_description: str
    full_description: str
    state: str = "All India"
    district: Optional[str] = None
    scheme_type: str = "Central"
    government_level: str = "Central"
    ministry: Optional[str] = None
    department: Optional[str] = None
    category: str = "General"
    sub_category: Optional[str] = None
    display_category: Optional[str] = None
    benefit: str
    benefit_amount: Optional[str] = None
    launch_year: Optional[int] = None
    status: str = "Active"
    target_beneficiaries: Optional[str] = None
    eligibility_mode: str = "DETERMINISTIC"
    eligibility_description: Optional[str] = None
    min_age: Optional[int] = 0
    max_age: Optional[int] = 120
    max_income: Optional[float] = 10000000.0
    occupation_rules: Optional[List[str]] = []
    category_rules: Optional[List[str]] = []
    gender_rules: Optional[List[str]] = []
    disability_rules: Optional[bool] = None
    special_conditions: Optional[List[str]] = []
    eligible_states: Optional[List[str]] = []
    eligible_categories: Optional[List[str]] = []
    eligible_occupations: Optional[List[str]] = []
    eligible_genders: Optional[List[str]] = []
    documents: List[str]
    application_steps: List[str]
    deadline: Optional[str] = "Open scheme"
    active: bool = True
    official_source_url: str
    official_application_url: str
    source_name: str = "Official Portal"
    last_verified_at: str = "2026-08-15"
    verification_status: str = "VERIFIED"

class SchemeOut(BaseModel):
    id: int
    name: str
    short_name: Optional[str] = None
    short_description: str
    full_description: str
    state: str
    district: Optional[str] = None
    scheme_type: str
    government_level: str
    ministry: Optional[str] = None
    department: Optional[str] = None
    category: str
    sub_category: Optional[str] = None
    display_category: Optional[str] = None
    benefit: str
    benefit_amount: Optional[str] = None
    launch_year: Optional[int] = None
    status: str
    target_beneficiaries: Optional[str] = None
    eligibility_mode: str
    eligibility_description: Optional[str] = None
    min_age: Optional[int] = 0
    max_age: Optional[int] = 120
    max_income: Optional[float] = 10000000.0
    occupation_rules: Optional[List[str]] = []
    category_rules: Optional[List[str]] = []
    gender_rules: Optional[List[str]] = []
    disability_rules: Optional[bool] = None
    special_conditions: Optional[List[str]] = []
    eligible_states: Optional[List[str]] = []
    eligible_categories: Optional[List[str]] = []
    eligible_occupations: Optional[List[str]] = []
    eligible_genders: Optional[List[str]] = []
    documents: List[str]
    application_steps: List[str]
    deadline: Optional[str] = None
    active: bool
    official_source_url: str
    official_application_url: str
    source_name: str
    last_verified_at: str
    verification_status: str
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class PaginatedSchemesResponse(BaseModel):
    items: List[SchemeOut]
    total: int
    page: int
    page_size: int
    total_pages: int

# --- ELIGIBILITY SCHEMAS ---
class MatchResult(BaseModel):
    scheme: SchemeOut
    eligible: bool
    score: int
    matched_criteria: List[str]
    failed_criteria: List[str]
    near_match: bool
    explanation_summary: str
    disclaimer: str = "SchemeSetu provides information for discovery and guidance. Final eligibility, benefits, documents and application status must be confirmed on the official government portal."

class EligibilityRequest(BaseModel):
    profile: ProfileSchema

# --- PASSBOOK / APPLICATION SCHEMAS ---
class SavedSchemeOut(BaseModel):
    id: int
    scheme: SchemeOut
    created_at: datetime.datetime

    class Config:
        from_attributes = True

class ApplicationUpdate(BaseModel):
    status: str
    notes: Optional[str] = None
    documents_ready: Optional[List[str]] = None

class ApplicationOut(BaseModel):
    id: int
    scheme: SchemeOut
    status: str
    notes: Optional[str] = None
    documents_ready: List[str] = []
    created_at: datetime.datetime
    updated_at: datetime.datetime

    class Config:
        from_attributes = True

# --- CHATBOT SCHEMAS ---
class ChatMessage(BaseModel):
    query: str

class ChatResponse(BaseModel):
    answer: str
    related_schemes: List[SchemeOut] = []
    disclaimer: str = "SchemeSetu provides information for discovery and guidance. Final eligibility, benefits, documents and application status must be confirmed on the official government portal."
