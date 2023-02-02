import { createGlobalStyle } from 'styled-components';
import { StyleConstants } from './StyleConstants';
/* istanbul ignore next */
export const GlobalStyle = createGlobalStyle`
  html,
  body {
    height: 100%;
    width: 100%;
    line-height: 1.5;
  }

  body {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    padding-top: ${StyleConstants.NAV_BAR_HEIGHT};
    background-color: ${p => p.theme.background};
  }

  body.fontLoaded {
    font-family: 'Inter', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }
  
  p,
  label {
    line-height: 1.5em;
  }

  input, select, button {
    font-family: inherit;
    font-size: inherit;
  }

  .icon {
    width: 1.5rem;
    height: 1.5rem;
  }

  .card {
    background-color: initial;
    border: initial;
    margin-top: 5rem;
  }

  .btn.btn-primary.btn-block.login {
    width: 100%;
    margin-top: 1.5em;
  }

  .profile-img-card {
    max-width: 15rem;
  }

  .alert-danger {
    background-color: initial;
    border: initial;
  }

  .btn-primary {
    background-color: #f99260;
    border-color: #c6734c;
  }

  .btn-primary:hover {
    background-color: #ea6f33;
    border-color: #c6734c;
  }

  .btn-primary:disabled {
    background-color: #bdbdbd;
    border-color: #bcbcbc;
  }

  .alert {
    padding: 0;
  }

  .no-underline {
    text-decoration: none;
  }

  .login-icon {
    width: 23px;
    margin-right: 6px;
  }
`;
