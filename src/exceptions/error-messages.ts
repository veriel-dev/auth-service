import { ErrorCodes } from './error-code';

export const ErrorMessages = {
  [ErrorCodes.AUTH.USER_NOT_FOUND]: 'Usuario no encontrado',
  [ErrorCodes.AUTH.INVALID_CREDENTIALS]: 'Credenciales inválidas',
  [ErrorCodes.AUTH.EMAIL_ALREADY_EXISTS]: 'El email ya está registrado',
  [ErrorCodes.AUTH.INVALID_TOKEN]: 'Token inválido',
  [ErrorCodes.AUTH.INSUFFICIENT_PERMISSIONS]: 'Permisos insuficientes',

  [ErrorCodes.USER.USER_NOT_FOUND]: 'Usuario no encontrado',
  [ErrorCodes.USER.INVALID_DATA]: 'Datos de usuario inválidos',
  [ErrorCodes.USER.UPDATED_FAILED]: 'Error al actualizar usuario',
  [ErrorCodes.USER.DELETE_FAILED]: 'Error al eliminar usuario',
  [ErrorCodes.USER.CREATE_FAILED]: 'Error al crear usuario',
  [ErrorCodes.GENERIC.VALIDATION_ERROR]: 'Error inesperado',
  [ErrorCodes.GENERIC.DATABASE_ERROR]: 'Error en la base de datos',
  [ErrorCodes.GENERIC.UNEXPECTED_ERROR]: 'Error inesperado',
  [ErrorCodes.GENERIC.SYSTEM_ERROR]: 'Error interno del sistema',
};
