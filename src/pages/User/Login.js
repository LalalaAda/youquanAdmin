import React, { Component } from 'react';
import { connect } from 'dva';
import { Row, Col, Alert } from 'antd';
import Login from '@/components/Login';
import styles from './Login.less';

const { UserName, Password, Submit } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))

class LoginPage extends Component {
  state = {
    type: 'account'
  };

  handleSubmit = (err, values) => {
    const { type } = this.state;
    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: 'login/login',
        payload: {
          ...values,
          type,
        },
      });
    }
  };

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { login, submitting } = this.props;
    return (
      <Row className={styles.centerbox}>
        <Col xs={{ span: 0 }} lg={{ span: 12 }} className={styles.left}>
          <div className={styles.leftbg} />
          <h3>hello</h3>
          <p>欢迎登录</p>
        </Col>
        <Col xs={{ span: 24 }} lg={{span: 12}} className={styles.right}>
          <h3>券后台管理系统</h3>
          <Login 
            onSubmit={this.handleSubmit}
            ref={form => { this.loginForm = form; }}
            className={styles.loginbox}
          >
            {login.status === 'error' &&
              !submitting &&
              this.renderMessage("账户或密码错误")}
            <UserName 
              name="userName"
              placeholder="用户名"
              rules={[
                {
                  required: true,
                  message: "请输入用户名！",
                },
              ]}
            />
            <Password
              name="password"
              placeholder="密码"
              rules={[
                {
                  required: true,
                  message: "请输入密码！",
                },
              ]}
              onPressEnter={e => {
                e.preventDefault();
                this.loginForm.validateFields(this.handleSubmit);
              }}
            />
            <Submit loading={submitting} className={styles.loginbtn}>
              登录
            </Submit>
          </Login>
        </Col>
      </Row>

    );
  }
}

export default LoginPage;
