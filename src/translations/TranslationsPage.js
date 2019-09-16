import React from 'react';
import ApiUtils from '../utils/ApiUtils';
import TranslationListItem from './TranslationListItem';
import './TranslationsPage.css';

class TranslationsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      translations: [],
    };
  }

  async componentDidMount() {
    try {
      const qs = '?collectionName=translations';
      const resp = await
        fetch(`${ApiUtils.origin}${ApiUtils.path}getEntireCollection${qs}`);

      const translations = await resp.json();

      this.setState({
        translations,
        loading: false,
      });
    } catch(err) {
      console.error(err);
    }
  }

  renderTranslations() {
    return (
      <ul className="translations-list">
        {
          this.state.translations.map((translation, translationIdx) => {
            return (
              <TranslationListItem
                key={translationIdx}
                translation={translation}
              />
            );
          })
        }
      </ul>
    );
  }

  render() {
    return (
      <div>
        {this.state.loading ? <div>Loading...</div> : this.renderTranslations()}
      </div>
    );
  }
}

export default TranslationsPage;
