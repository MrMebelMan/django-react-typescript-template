import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { NavBar } from 'app/components/NavBar';
import { PageWrapper } from 'app/components/PageWrapper';
import { H1 } from './components/H1';
import axios from 'axios';
// import { userContext } from 'app/context';

import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import FormGroup from 'react-bootstrap/FormGroup';
import { FormLabel } from 'app/components/FormLabel';
import { config, setSessionCookie } from 'app/utils';
// import { useAuth } from 'app/auth';

export function LoginPage() {
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [captchaImage, setCaptchaImage] = useState('');
  const [captchaChallenge, setCaptchaChallenge] = useState('');
  // const { user, setUser } = useContext(userContext);
  // const { user, login, logout } = useAuth();

  const validate = () => {
    return Yup.object().shape({
      username: Yup.string().required('This field is required!'),
      password: Yup.string().required('This field is required!'),
      captcha: Yup.string().required('This field is required!'),
    });
  };

  const handleSubmit = async (formValue: {
    username: string;
    password: string;
    captcha: string;
  }) => {
    validate();
    setErrorMessage('');
    setLoading(true);
    try {
      const response = await fetch(`${config.API_URL}/token/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formValue.username,
          password: formValue.password,
          captcha_value: formValue.captcha,
          captcha_challenge: captchaChallenge,
        }),
      });
      const json = await response.json();
      if (response.status !== 200) {
        setLoading(false);
        setCaptchaImage('');
        getCaptcha();
        setErrorMessage(json.detail);
        return;
      }
      setCaptchaImage('');
      setCaptchaChallenge('');
      setErrorMessage('');
      // login(json);
      setSessionCookie(json.access, json.refresh);
      window.location.href = '/';
    } catch (e) {
      getCaptcha();
      setLoading(false);
      console.error(e);
      setErrorMessage("Немає зв'язку зі сервером! 😭");
      throw e;
    }
  };

  const getCaptcha = async () => {
    const response = await axios.get(`${config.API_URL}/captcha`);
    setCaptchaImage(response.data.base64);
    setCaptchaChallenge(response.data.challenge);
  };

  useEffect(() => {
    getCaptcha();
  }, []);

  return (
    <>
      {/* <userContext.Provider value={{ user, setUser: login }}> */}
      <Helmet>
        <title>Login Page</title>
        <meta
          name="description"
          content="A React Boilerplate application login page"
        />
      </Helmet>
      <NavBar />
      <PageWrapper>
        <Container>
          <Col md={12}>
            <Card>
              <H1 className="mx-auto d-block">Log in to your account</H1>
              <Formik
                initialValues={{ username: '', password: '', captcha: '' }}
                validationSchema={validate}
                onSubmit={handleSubmit}
              >
                <Form className="mx-auto d-block">
                  <FormGroup>
                    <FormLabel htmlFor="username">Username</FormLabel>
                    <Field
                      name="username"
                      type="text"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="username"
                      component="div"
                      className="alert alert-danger"
                    />
                  </FormGroup>

                  <FormGroup>
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <Field
                      name="password"
                      type="password"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="alert alert-danger"
                    />
                  </FormGroup>

                  {captchaImage && (
                    <FormGroup>
                      <Row>
                        <img
                          className="captcha-image mt-2"
                          alt="captcha"
                          src={`data:image/png;base64, ${captchaImage}`}
                        />
                      </Row>
                      <FormLabel htmlFor="captcha">Captcha</FormLabel>
                      <Field
                        name="captcha"
                        type="text"
                        className="form-control"
                      />
                      <ErrorMessage
                        name="captcha"
                        component="div"
                        className="alert alert-danger"
                      />
                    </FormGroup>
                  )}

                  <FormGroup>
                    <Button
                      type="submit"
                      className="btn btn-primary btn-block login"
                      disabled={loading}
                    >
                      {loading && (
                        <span className="spinner-border spinner-border-sm"></span>
                      )}
                      <span>Login</span>
                    </Button>
                  </FormGroup>

                  {errorMessage && (
                    <div className="form-group">
                      <div className="alert alert-danger" role="alert">
                        {errorMessage}
                      </div>
                    </div>
                  )}
                </Form>
              </Formik>
            </Card>
          </Col>
        </Container>
      </PageWrapper>
      {/* </userContext.Provider> */}
    </>
  );
}
