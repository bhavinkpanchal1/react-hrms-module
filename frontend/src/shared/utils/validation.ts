export interface AgeValidationOptions {
  minAge: number;
  maxAge: number;
}

export const isAgeBetween = (
  date: string,
  { minAge, maxAge }: AgeValidationOptions,
): boolean => {
  if (!date) return false;

  const dob = new Date(date);

  if (Number.isNaN(dob.getTime())) {
    return false;
  }

  const today = new Date();

  let age = today.getFullYear() - dob.getFullYear();

  const birthdayPassed =
    today.getMonth() > dob.getMonth() ||
    (today.getMonth() === dob.getMonth() &&
      today.getDate() >= dob.getDate());

  if (!birthdayPassed) {
    age--;
  }

  return age >= minAge && age <= maxAge;
};