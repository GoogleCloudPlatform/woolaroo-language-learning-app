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

  componentDidMount() {
    const qs = '?collectionName=translations';
    fetch(`${ApiUtils.origin}${ApiUtils.path}getEntireCollection${qs}`)
    .then(resp => resp.json())
    .then((resp) => {
      this.setState({
        translations: resp,
        loading: false,
      })
    })
    .catch((err) => {
      console.error(err);
    });
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
