import emailjs from '@emailjs/browser';
import { RedefinirSenhaConfirmar } from "./RedefinirSenhaConfirmar";
import { useNavigate } from 'react-router-dom';
import { OTP } from "./OTP";
import { RedefinirSenhaEmail } from './RedefinirSenhaEmail';
import React, { useEffect, useState } from 'react';
import styles from './RedefinirSenha.module.css';
import { toast, Flip, Zoom } from 'react-toastify';
import { api } from '../../api'

export const RedefinirSenha = () => {
  const navigate = useNavigate();
  const userKeyEmail = import.meta.env.VITE_EMAIL_USER_KEY;

  const [email, setEmail] = useState('');
  const [tokenDigitado, setTokenDigitado] = useState(new Array(4).fill(''));
  const [newPassword, setNewPassword] = useState('');
  const [etapa, setEtapa] = useState(1);
  const [tokenGerado, setTokenGerado] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [tokenExpirado, setTokenExpirado] = useState(false);
  const [templateParams, setTemplateParams] = useState({});


  //==================================================================================================

  //**LOGICA DO EMAIL**
  const getDomain = (email) => email.split('@')[1];

  const getEmailServiceParams = (domain) => {
    switch (domain) {
      case 'outlook.com':
      case 'hotmail.com':
        return { serviceId: 'domRoqueOutlook', templateId: 'template_iaf08mn' };
      case 'zoho.com':
        return { serviceId: 'domRoqueZoho', templateId: 'template_iaf08mn' };
      case 'yahoo.com':
        return { serviceId: 'service_yahoo', templateId: 'template_iaf08mn' };
      default:
        return { serviceId: 'domRoqueGmail', templateId: 'template_iaf08mn' };
    }
  };

  const tokenGenerator = () => {
    return (Math.floor(1000 + Math.random() * 9000)).toString();
  };

  useEffect(() => {
    if (tokenGerado) {
      // const domain = getDomain(email);
      // const { serviceId, templateId } = getEmailServiceParams(domain);

      // setTemplateParams({ message: tokenGerado, to_email: email });

      // if (email) {
      //   emailjs.send(serviceId, templateId, { message: tokenGerado, to_email: email }, userKeyEmail)
      //     .then(() => {
      //       toast.success('Token enviado com sucesso', { transition: Flip });
      //       setTokenExpirado(false);
      //       setTimeout(() => setTokenExpirado(true), 5 * 60 * 1000); // Expira após 5 minutos
      console.log(tokenGerado)
      setEtapa(2);

      //     })
      //     .catch(() => {
      //       toast.error('Não conseguimos enviar o token, verifique se o email está correto', { transition: Zoom });
      //     });
      // } else {
      //   toast.error('O endereço de e-mail está vazio. Por favor, insira um e-mail válido.', { transition: Zoom });
      // }
    }
  }, [tokenGerado, email]);

  const handleSendEmail = () => {
    const generatedToken = tokenGenerator();
    setTokenGerado(generatedToken);
  };
  //**LÓGICA DO EMAIL**

  //==================================================================================================

  //**LÓGICA DO TOKEN**
  const handleOtpConfirmed = (event) => {
    event.preventDefault();
    if (tokenExpirado) {
      toast.error('O token expirou. Por favor, solicite um novo.', { transition: Zoom });
      return;
    }
    if (tokenDigitado.join('') === tokenGerado) {
      toast.success('Token válido', { transition: Flip });
      setTimeout(() => setEtapa(3), 2000);
    } else {
      toast.error('Token incorreto', { transition: Zoom });
    }
  };
  //**LÓGICA DO TOKEN **

  //==================================================================================================

  //**LÓGICA DO UPDATE SENHA
  const handleUpdatePassword = (event) => {
    event.preventDefault();
    const regexMinLength = /^.{6,}$/;
    const regexNumber = /\d/;
    const regexSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
    const regexNoSpaces = /^\S*$/;

    if (!regexMinLength.test(newPassword)) {
      toast.error("A senha deve conter no mínimo 6 caracteres", { transition: Zoom });
    } else if (!regexNumber.test(newPassword)) {
      toast.error("A senha deve conter pelo menos um número", { transition: Zoom });
    } else if (!regexSpecialChar.test(newPassword)) {
      toast.error("A senha deve conter pelo menos um caractere especial", { transition: Zoom });
    } else if (!regexNoSpaces.test(newPassword)) {
      toast.error("A senha não pode conter espaços", { transition: Zoom });
    } else if (newPassword !== confirmarSenha) {
      toast.error("Senhas não coincidem", { transition: Zoom });
    } else {

      api.get('/clients/search-by-email', { params: { email } })
        .then((response) => {
          if (response.status === 200) {
            let id = response.data.id;
            const passwordUpdateParams = {
              id: id,
              password: newPassword
            };
            console.log(passwordUpdateParams);
            api.patch('/clients/redefine-password', null, { params: passwordUpdateParams})
              .then((response) => {
                if (response.status === 200) {
                  toast.success("Senha atualizada com sucesso", { transition: Flip });
                }
              })
              .catch((error) => {
                toast.error("Erro ao redefinir a senha", { transition: Zoom });
                console.error("Erro ao salvar a senha", error);
              });
          }
        })
        .catch((error) => {
          console.error("Erro ao verificar e-mail:", error);
          toast.error("Erro ao verificar e-mail", { transition: Zoom });
        });
    }
  };
  //**LÓGICA DO UPDATE SENHA**

  //==================================================================================================

  return (
    <main className={styles['main-redefinir']}>
      <section>
        {etapa === 1 && (
          <RedefinirSenhaEmail
            email={email}
            setEmail={setEmail}
            handleSendEmail={handleSendEmail}
          />
        )}
        {etapa === 2 && (
          <OTP
            tokenDigitado={tokenDigitado}
            setTokenDigitado={setTokenDigitado}
            handleOtpConfirmed={handleOtpConfirmed}
            handleSendEmail={handleSendEmail}
          />
        )}
        {etapa === 3 && (
          <RedefinirSenhaConfirmar
            newPassword={newPassword}
            setNewPassword={setNewPassword}
            confirmarSenha={confirmarSenha}
            setConfirmarSenha={setConfirmarSenha}
            handleUpdatePassword={handleUpdatePassword}
          />
        )}
      </section>
    </main>
  );
};
