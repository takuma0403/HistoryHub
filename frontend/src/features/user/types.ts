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
  description: string;
  isMainSkill: boolean;
}

export interface SkillRequest {
  name: string;
  description: string;
  isMainSkill: boolean;
}

export interface UpdateSkillRequest extends SkillRequest {
  id: string;
}

export interface WorkResponse {
  id: string;
	userId: string;
	name: string;
	description: string;
	imagePath: string;
	link: string;
	period: string;
	use: string;
}

export interface WorkRequest {
  id: string;
	userId: string;
	name: string;
	description: string;
	image: File;
	link: string;
	period: string;
	use: string;
}
