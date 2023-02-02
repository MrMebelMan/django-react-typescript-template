import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { NavBar } from 'app/components/NavBar';
import { PageWrapper } from 'app/components/PageWrapper';
import { H1 } from './components/H1';

import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';

import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Container from 'react-bootstrap/Container';
import FormGroup from 'react-bootstrap/FormGroup';
import { FormLabel } from 'app/components/FormLabel';

export function LoginPage() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    return Yup.object().shape({
      username: Yup.string().required('This field is required!'),
      password: Yup.string().required('This field is required!'),
    });
  };

  const handleSubmit = (formValue: { username: string; password: string }) => {
    validate();
    setMessage('');
    setLoading(true);
  };

  return (
    <>
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
                initialValues={{ username: '', password: '' }}
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

                  {message && (
                    <div className="form-group">
                      <div className="alert alert-danger" role="alert">
                        {message}
                      </div>
                    </div>
                  )}
                </Form>
              </Formik>
            </Card>
          </Col>
        </Container>
      </PageWrapper>
    </>
  );
}
