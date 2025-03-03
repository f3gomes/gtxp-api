const welcomeEmailTemplate =
  '<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Confirme seu e-mail</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,sans-serif;line-height:1.6;background-color:#f4f4f4}.container{max-width:600px;margin:0 auto;padding:20px;background-color:#ffffff}.header{text-align:center;padding:20px 0;background-color:#05bfe0;color:#ffffff}.content{padding:30px 20px;color:#333333}.button{display:inline-block;padding:12px 30px;margin:20px 0;background-color:#05bfe0;color:#ffffff;text-decoration:none;border-radius:5px;font-weight:bold}.footer{text-align:center;padding:20px;color:#666666;font-size:12px;border-top:1px solid #eeeeee}</style></head><body><div class="container"><div class="header"><h1>Bem-vindo ao CRGPL!</h1></div><div class="content"><h2>Olá ${userName},</h2><p>Obrigado por se cadastrar em nossa plataforma! Para começar a usar todos os nossos recursos, precisamos que você confirme seu endereço de e-mail.</p><p style="text-align:center;"><a href="${confirmationLink}" class="button text-white">Confirmar E-mail</a></p></div><div class="footer"><p>Este é um e-mail automático, por favor não responda.</p><p>&copy; 2024 CRGPL. Todos os direitos reservados.</p></div></div></body></html>';

const resetPasswordEmailTemplate =
  '<!DOCTYPE html><html lang="pt-BR"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title class="text-white">Crie uma nova senha</title><style>*{margin:0;padding:0;box-sizing:border-box}body{font-family:Arial,sans-serif;line-height:1.6;background-color:#f4f4f4}.container{max-width:600px;margin:0 auto;padding:20px;background-color:#ffffff}.header{text-align:center;padding:20px 0;background-color:#05bfe0;color:#ffffff}.content{padding:30px 20px;color:#333333}.button{display:inline-block;padding:12px 30px;margin:20px 0;background-color:#05bfe0;color:#ffffff;text-decoration:none;border-radius:5px;font-weight:bold}.footer{text-align:center;padding:20px;color:#666666;font-size:12px;border-top:1px solid #eeeeee}</style></head><body><div class="container"><div class="header"><h1>CRGPL!</h1></div><div class="content"><h2>Olá ${userName},</h2><p>Clique no link abaixo para criar uma nova senha.</p><p style="text-align:center;"><a href="${resetLink}" class="button">Nova senha</a></p></div><div class="footer"><p>Este é um e-mail automático, por favor não responda.</p><p>&copy; 2024 CRGPL. Todos os direitos reservados.</p></div></div></body></html>';

export const generateEmail = async (
  userName: string,
  confirmationLink: string
) => {
  return welcomeEmailTemplate
    .replace("${userName}", userName)
    .replace("${confirmationLink}", confirmationLink);
};

export const generateEmailResetPassword = async (
  userName: string,
  resetLink: string
) => {
  return resetPasswordEmailTemplate
    .replace("${userName}", userName)
    .replace("${resetLink}", resetLink);
};

export const confirmTemplate = `
  <!DOCTYPE html>
  <html>
      <head>
          <style>
              body { 
                  font-family: Arial; 
                  text-align: center;
                  padding: 50px;
              }
              .success {
                  color: green;
                  font-size: 24px;
              }
          </style>
      </head>
      <body>
          <h1 class="success">Email verificado com sucesso!</h1>
          <p>Sua conta foi ativada.</p>
      </body>
  </html>
`;
