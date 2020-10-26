import * as React from "react";
import { NavLink, SocialMediaIcon } from "..";
import { TypedSecondaryMenuQuery } from "./queries";

import { SOCIAL_MEDIA } from "../../core/config";
import "./scss/index.scss";
import LocaleSelect from "./LocaleSelect";

class Footer extends React.PureComponent {
  render() {
    return (
      <footer className="footer-nav">
        <div className="container">
          <TypedSecondaryMenuQuery>
            {({ data }) => {
              return data.shop.navigation.secondary.items.map(item => (
                <div className="footer-nav__section" key={item.id}>
                  <h4 className="footer-nav__section-header">
                    <NavLink item={item} />
                  </h4>
                  <div className="footer-nav__section-content">
                    {item.children.map(subItem => (
                      <p key={subItem.id}>
                        <NavLink item={subItem} />
                      </p>
                    ))}
                  </div>
                </div>
              ));
            }}
          </TypedSecondaryMenuQuery>
          <div className="footer-nav__section right">
            <h4 className="footer-nav__section-header">Social Media</h4>
            <div className="footer__favicons">
              {SOCIAL_MEDIA.map(medium => (
                <SocialMediaIcon medium={medium} key={medium.ariaLabel} />
              ))}
            </div>
          </div>
          <LocaleSelect />
        </div>
      </footer>
    );
  }
}

export default Footer;
