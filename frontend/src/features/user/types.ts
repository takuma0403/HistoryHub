export interface UsernameResponse {
  username: string;
}

export interface UsernameRequest {
  username: string;
}

export interface profileResponse {
  id: string;
  userId: string;
  lastName: string;
  firstName: string;
  birthDate: string;
  school: string;
  hobby: string;
}

export interface ProfileRequest {
  lastName: string;
  firstName: string;
  birthDate: string;
  school: string;
  hobby: string;
}

export interface SkillResponse {
  id: string;
  profileId: string;
  name: string;
  descriptionn: string;
  isMainSkill: string;
}

export interface SkillRequest {
  name: string;
  descriptionn: string;
  isMainSkill: string;
}

export interface UpdateSkillRequest extends SkillRequest {
  id: string;
}
