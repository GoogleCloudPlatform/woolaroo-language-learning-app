import React from "react";
import "./SocialMediaComponent.scss";

class SocialMediaComponent extends React.Component {

  isSampleText = (text) => {
    if(text !== null && typeof(text) !== 'undefined') {
      return text.startsWith('text://');
    }
    return true;
  }

  render() {

    const { socialMediaIcons } = this.props;

    return (
        <div className="social-media-container">

          {
            Array.isArray(socialMediaIcons) ? socialMediaIcons.map((entry, index) => {
              if(this.isSampleText(entry)) {
                return (
                  <div 
                  key={index}
                  className="social-media-icon-container">
                  Social Media Icon
                </div>
                )
              }
              //Else return divs with social media icons

            }) : null
          }
          
        </div>
    );
  }




}

export default SocialMediaComponent;