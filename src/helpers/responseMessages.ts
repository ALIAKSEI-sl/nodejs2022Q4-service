export const enum StatusCode {
  ok = 200,
  created = 201,
  noContent = 204,
  badRequest = 400,
  forbidden = 403,
  notFound = 404,
  unprocessableEntity = 422,
  internalServerError = 500,
}

export const enum ErrorMessages {
  nonExistentUser = "UserId doesn't exist",
  nonExistentEndpoint = 'Endpoint does not exist',
  notUuid = "UserId isn't uuid",
  serverError = 'Sorry, error on the server',
  ok = 'successfully',
  invalidJson = 'Invalid JSON request',
  requiredFields = "Required fields are missing or don't match the type",
  createdUser = 'A new record has been created',
}
