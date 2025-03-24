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
  const [emailExists, setEmailExists] = useState(false)


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
    if (emailExists && tokenGerado) {
      const domain = getDomain(email);
      const { serviceId, templateId } = getEmailServiceParams(domain);

      setTemplateParams({ message: tokenGerado, to_email: email });

      emailjs.send(serviceId, templateId, { message: tokenGerado, to_email: email }, userKeyEmail)
        .then(() => {
          toast.success('Token enviado com sucesso', {
            transition: Flip,
            autoClose: 2000,
            closeOnClick: true
          });
          setTokenExpirado(false);
          setTimeout(() => setTokenExpirado(true), 5 * 60 * 1000); // Expira após 5 minutos
          console.log(tokenGerado)
          setEtapa(2);

        })
        .catch(() => {
          toast.error('Não conseguimos enviar o token, verifique se o email está correto', {
            transition: Zoom, autoClose: 2000,
            closeOnClick: true
          });
        });
    }
  }, [tokenGerado, email]);

  const handleEmailExists = () => {
    if (email === '') {
      toast.error('Preencha o endereço de e-mail.', {
        transition: Zoom,
        autoClose: 2000,
        closeOnClick: true
      });
    } else {
      api.get('/clients/search-by-email', { params: { email } })
        .then((response) => {
          if (response.status === 200) {
            setEmailExists(true);
            const generatedToken = tokenGenerator();
            setTokenGerado(generatedToken);
            setEmail(email)
          } else {
            toast.error('Não existe usuário com o endereço de e-mail.', {
              transition: Zoom,
              autoClose: 2000,
              closeOnClick: true
            });
          }
        })
        .catch((error) => {
          console.error("Erro ao verificar e-mail:", error);
          toast.error("Não existe usuário cadastrado com este email", {
            transition: Zoom,
            autoClose: 2000,
            closeOnClick: true
          });
        });
    }
  };

  const handleSendEmail = () => {
    handleEmailExists();
  };
  //**LÓGICA DO EMAIL**

  //==================================================================================================

  //**LÓGICA DO TOKEN**
  const handleOtpConfirmed = (event) => {
    event.preventDefault();
    if (tokenExpirado) {
      toast.error('O token expirou. Por favor, solicite um novo.', {
        transition: Zoom,
        autoClose: 2000,
        closeOnClick: true
      });
      return;
    }
    if (tokenDigitado.join('') === tokenGerado) {
      toast.success('Token válido', {
        transition: Flip,
        autoClose: 2000,
        closeOnClick: true
      });
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
      toast.error("A senha deve conter no mínimo 6 caracteres", {
        transition: Zoom,
        autoClose: 2000,
        closeOnClick: true
      });
    } else if (!regexNumber.test(newPassword)) {
      toast.error("A senha deve conter pelo menos um número", {
        transition: Zoom,
        autoClose: 2000,
        closeOnClick: true
      });
    } else if (!regexSpecialChar.test(newPassword)) {
      toast.error("A senha deve conter pelo menos um caractere especial", {
        transition: Zoom,
        autoClose: 2000,
        closeOnClick: true
      });
    } else if (!regexNoSpaces.test(newPassword)) {
      toast.error("A senha não pode conter espaços", {
        transition: Zoom,
        autoClose: 2000,
        closeOnClick: true
      });
    } else if (newPassword !== confirmarSenha) {
      toast.error("Senhas não coincidem", {
        transition: Zoom,
        autoClose: 2000,
        closeOnClick: true
      });
    } else {
      const passwordUpdateParams = {
        email,
        newPassword: newPassword
      }
      api.patch('/clients/reset-password', passwordUpdateParams)
        .then((response) => {
          if (response.status === 200) {
            toast.success("Senha atualizada com sucesso", {
              transition: Flip,
              autoClose: 2000,
              closeOnClick: true
            });
            navigate('/login')
          }
        })
        .catch((error) => {
          toast.error("Erro ao redefinir a senha", {
            transition: Zoom,
            autoClose: 2000,
            closeOnClick: true
          });
          console.error("Erro ao salvar a senha", error);
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
