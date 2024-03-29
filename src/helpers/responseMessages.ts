export const enum ErrorMessages {
  nonExistentUser = "User doesn't exist",
  nonExistentTrack = "Track doesn't exist",
  nonExistentAlbum = "Album doesn't exist",
  nonExistentArtist = "Artist doesn't exist",
  equalPasswords = 'The new password cannot equal the old password',
  incorrectPassword = 'Incorrect password entered',
  userAlreadyExists = 'User with this login already exists',
  nonValidate = "no user with such login or password doesn't match actual one",
  noRefreshToken = 'no refreshToken in body',
  invalidRefreshToken = 'Refresh token is invalid or expired',
}
