import React, { Component } from 'react';
import { Layout } from 'antd';
import { connect } from 'dva';
// import router from 'umi/router';
import Animate from 'rc-animate';
import defaultSetting from '../defaultSettings';
import GlobalHeader from '@/components/GlobalHeader';
import TopNavHeader from '@/components/TopNavHeader';
import styles from './Header.less';

const { Header } = Layout;

class HeaderView extends Component {
  state = {
    visible: true,
  };

  static getDerivedStateFromProps(_, state) {
    if (!defaultSetting.autoHideHeader && !state.visible) {
      return {
        visible: true,
      };
    }
    return null;
  }

  componentDidMount() {
    document.addEventListener('scroll', this.handScroll, { passive: true });
  }

  componentWillUnmount() {
    document.removeEventListener('scroll', this.handScroll);
  }

  getHeadWidth = () => {
    const { isMobile, collapsed } = this.props;
    const { fixedHeader, layout } = defaultSetting;
    if (isMobile || !fixedHeader || layout === 'topmenu') {
      return '100%';
    }
    return collapsed ? 'calc(100% - 80px)' : 'calc(100% - 256px)';
  };


  handleMenuClick = ({ key }) => {
    const { dispatch } = this.props;
    // if (key === 'userCenter') {
    //   router.push('/account/center');
    //   return;
    // }
    // if (key === 'triggerError') {
    //   router.push('/exception/trigger');
    //   return;
    // }
    if (key === 'userinfo') {
      // TODO add用户个人中心
      // router.push('/account/settings/base');
      return;
    }
    if (key === 'logout') {
      dispatch({
        type: 'login/logout',
      });
    }
  };

  logoutClick = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'login/logout',
    })
  };

  handScroll = () => {
    const { autoHideHeader } = defaultSetting;
    const { visible } = this.state;
    if (!autoHideHeader) {
      return;
    }
    const scrollTop = document.body.scrollTop + document.documentElement.scrollTop;
    if (!this.ticking) {
      this.ticking = true;
      requestAnimationFrame(() => {
        if (this.oldScrollTop > scrollTop) {
          this.setState({
            visible: true,
          });
        } else if (scrollTop > 300 && visible) {
          this.setState({
            visible: false,
          });
        } else if (scrollTop < 300 && !visible) {
          this.setState({
            visible: true,
          });
        }
        this.oldScrollTop = scrollTop;
        this.ticking = false;
      });
    }
  };

  render() {
    const { isMobile, handleMenuCollapse } = this.props;
    const { navTheme, layout, fixedHeader } = defaultSetting;
    const { visible } = this.state;
    const isTop = layout === 'topmenu';
    const width = this.getHeadWidth();
    const HeaderDom = visible ? (
      <Header style={{ padding: 0, width }} className={fixedHeader ? styles.fixedHeader : ''}>
        {isTop && !isMobile ? (
          <TopNavHeader
            theme={navTheme}
            mode="horizontal"
            onCollapse={handleMenuCollapse}
            onMenuClick={this.handleMenuClick}
            {...this.props}
          />
        ) : (
          <GlobalHeader
            onCollapse={handleMenuCollapse}
            onMenuClick={this.handleMenuClick}
            onLogoutClick={this.logoutClick}
            {...this.props}
            className={styles.dark}
          />
        )}
      </Header>
    ) : null;
    return (
      <Animate component="" transitionName="fade">
        {HeaderDom}
      </Animate>
    );
  }
}

export default connect(({ user, global }) => ({
  currentUser: user.currentUser,
  collapsed: global.collapsed,
}))(HeaderView);
