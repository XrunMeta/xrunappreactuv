export default {
  title: '인증코드를 입력하세요',
  description: '로 보내드린 6자리 코드를 입력하세요.',
  resendCode: '코드 재전송',
  verifyButton: '확인',
  errors: {
    emailNotFound: '이메일 정보를 찾을 수 없습니다.',
    codeRequired: '6자리 인증 코드를 입력해주세요.',
    verificationFailed: '인증 코드가 올바르지 않거나 만료된 요청입니다. 코드를 다시 받아 시도해주세요.',
    loginFailed: '로그인에 실패했습니다. 다시 시도해주세요.',
    userDataNotFound: '사용자 정보를 가져올 수 없습니다.',
    error: '인증 처리 중 오류가 발생했습니다.',
    resendFailed: '인증 코드 재전송에 실패했습니다. 다시 시도해주세요.',
    resendError: '인증 코드 재전송 중 오류가 발생했습니다.',
  },
  success: {
    resendComplete: '인증 코드를 다시 전송했습니다.',
  },
  alerts: {
    error: '오류',
    codeInput: '인증 코드 입력',
    verificationFailed: '인증 실패',
    loginFailed: '로그인 실패',
    resendComplete: '재전송 완료',
    resendFailed: '재전송 실패',
  },
  gmailGoogleLogin: {
    title: '구글 로그인 안내',
    message: 'Gmail 계정은 Google 로그인으로 연동하면 다음부터 간편 로그인할 수 있어요.',
    button: '구글 로그인',
    emailMismatchTitle: '이메일 불일치',
    emailMismatchMessage: '가입 시 입력하신 이메일 ({{email}}) 과 구글 로그인에 사용하신 이메일이 다릅니다.\n\n연동 없이 계속 진행합니다.',
    emailMismatchButton: '확인',
  },

  gmailGoogleLink: {
    askTitle: '구글 계정 연동',
    askMessage: '가입하신 Gmail 계정을 Google 로그인과 연동하시겠어요?\n연동하면 다음부터 간편하게 로그인할 수 있습니다.',
    link: '연동하기',
    skip: '나중에',
  },
};

