import React, { PureComponent } from 'react';
import { Button, Spin, Menu, Icon, Avatar} from 'antd';

import HeaderDropdown from '../HeaderDropdown';

import styles from './index.less';

export default class GlobalHeaderRight extends PureComponent {
  

  render() {
    const {
      currentUser,
     
      onMenuClick,
      onLogoutClick,
      
      theme,
    } = this.props;
    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        
        <Menu.Item key="userinfo">
          <Icon type="setting" />
          account settings
        </Menu.Item>
        
        <Menu.Divider />
        <Menu.Item key="logout">
          <Icon type="logout" />
          logout
        </Menu.Item>
      </Menu>
    );
    
    let className = styles.right;
    if (theme === 'dark') {
      className = `${styles.right}  ${styles.dark}`;
    }
    return (
      <div className={className}>
        {currentUser.name ? (
          <HeaderDropdown overlay={menu}>
            <span className={`${styles.action} ${styles.account}`}>
              <Avatar
                size="small"
                className={styles.avatar}
                src={currentUser.avatar}
                alt="avatar"
              />
              <span className={styles.name}>{currentUser.name}</span>
            </span>
          </HeaderDropdown>
        ) : (
          <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
        )}

        <Button type="primary" icon="poweroff" onClick={onLogoutClick} style={{ marginRight: 24 }}>
          注销
        </Button>
        
      </div>
    );
  }
}
