import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone } from '@fortawesome/free-solid-svg-icons';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="level is-dark">
          <div className="level-item">恒达交通</div>

          <div className="level-item">
            【产品经理】 李文阁 <FontAwesomeIcon icon={faPhone} fixedWidth />
            18645043300
          </div>

          <div className="level-item">返回顶部</div>
        </div>
      </div>
    </footer>
  );
}
