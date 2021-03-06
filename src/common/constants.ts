enum StaticStringKeys {
  INVALID_USERNAME = 'Usuário não informado!',
  UNKNOWN_REFRESH_TOKEN = 'Refresh Token não informado!',
  INVALID_MODIFIED_USER = 'Não é possível alterar outro usuário',
  INVALID_USERNAME_OR_EMAIL = 'Usuário ou E-mail não informado',
  INVALID_USERNAME_OR_PASSWORD = 'Usuário ou Senha inválidos',
  UNKNOWN_SECURITY_CODE = 'Código de segurança não informado',
  UNKNOWN_NEW_PASSWORD = 'Nova senha não informada',
  LOCKED_USER = 'Usuário bloqueado',
  INVALID_AUTHENTICATION_TYPE = 'Tipo de autenticação inválido',
  UNKNOWN_CREDENTIAL = 'Credenciais não informadas',
  UNKNOWN_USERNAME_OR_PASSWORD = 'Credenciais não Preenchidas',
  INVALID_TOKEN = 'Token inválido',
  INVALID_REFRESH_TOKEN = 'Refresh Token inválido',
  FAIL_GENERATE_REFRESH_TOKEN = 'Erro na geração do Refresh Token',
  FAIL_REMOVE_REFRESH_TOKEN = 'Erro ao Remover o Refresh Token',
  FAIL_FIND_USERS = 'Erro na consulta dos usuários',
  FAIL_FIND_USERS_BY_ID = 'Erro na consulta por ID',
  FAIL_FIND_USERS_BY_USERNAME = 'Erro na consulta por Username',
  FAIL_FIND_USERS_BY_USERNAME_PASSWORD = 'Erro na consulta por username e password',
  FAIL_REMOVE_USER = 'Erro ao Remover o Usuário',
  FAIL_REGISTER_LOGIN = 'Erro ao Registrar a falha de login',
  FAIL_FIND_USER_BY_SECURITY_CODE = 'Erro na consulta do SECURITY_CODE',
  FAIL_SAVE_USER = 'Erro ao Gravar o Usuário',
  FAIL_UPDATE_USER = 'Erro ao Alterar o Usuário',
  FAIL_GENERATE_RECOVER_PASSWORD = 'Erro ao Solicitar recuperação de senha',
  FAIL_RECOVER_PASSWORD = 'Erro ao recuperar a senha',
  //   INVALID_REQUEST = 'Invalid request',
  //   INVALID_CREDENTIAL = 'Invalid credential',
  //   INVALID_ACCESS_TOKEN = 'Invalid access token',
  //   //   INVALID_REFRESH_TOKEN = 'Invalid refresh token',
  //   INVALID_EMAIL = 'Invalid email',
  //   INVALID_PASSWORD = 'Invalid password',
  //   //   INVALID_USERNAME = 'Invalid username',
  //   USER_NOT_FOUND = 'User not found',
  //   USERNAME_NOT_AVAILABLE = 'Try another username',
  //   EMAIL_NOT_AVAILABLE = 'Try another email',
  //   UNKNOWN_ERROR_TRY_AGAIN = 'Unknown error occured. Please try again.',
  //   REPOSITORY_ERROR_INVALID_ID = 'Invalid id',
}

export default StaticStringKeys;
