import { decksDict } from "../constants/constants.js";

class Deck {
  constructor(type, language, speakText) {
    this.cards = this.suffle(decksDict[type].list);
    this.leftCardsCounter = this.cards.length;
    this.passedCards = [];
    this.currentCard = null;
    this.type = type;
    this.language = language;
    this.speakText = speakText;

    this.renderMainCards();
  }

  suffle = (deck) => {
    let suffledDeck = deck.slice();
    for (let i = suffledDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i);
      const temp = suffledDeck[i];
      suffledDeck[i] = suffledDeck[j];
      suffledDeck[j] = temp;
    }
    return suffledDeck;
  };

  pass = async () => {
    const newCard = this.cards.pop();
    if (newCard) {
      this.appendCardToHistory(newCard);
      this.passedCards.push(this.currentCard);
      this.currentCard = newCard;
      this.leftCardsCounter -= 1;
      this.renderMainCards();
      await this.speakText(newCard.name[this.language]);
      return true;
    } else {
      await this.speakText(
        this.language == "es" ? "Baraja terminada" : "Deck finished"
      );
      return false;
    }
  };

  renderMainCards = () => {
    const previousCard = document.querySelector("#previous-card");
    const currentCard = document.querySelector("#current-card");
    const currentCardContainer = currentCard.parentNode;

    if (this.currentCard) {
      // Use setTimeout to update the current card after the animation
      setTimeout(() => {
        if (this.passedCards.length > 1){
          currentCardContainer.style.transition = "all .5s"; // Add transition CSS property
          currentCardContainer.style.transform = `translate(-2rem, -2rem)`;
        }
        setTimeout(() => {
          currentCard.src = `src/assets/${this.currentCard.image}`;
          currentCardContainer.style.transition = ""; // Reset the transition property after the animation
          currentCardContainer.style.transform = ""; // Reset the transform to its original position
          currentCard.style.opacity = "1";

          if (this.passedCards.length > 1) {
            previousCard.src = `src/assets/${
              this.passedCards[this.passedCards.length - 1].image
            }`;
            previousCard.style.opacity = "1";
          } else {
            previousCard.style.opacity = "0";
          }
        }, 500); // Set the same duration as the transition (in milliseconds)
      }, 10); // A small delay to ensure the initial CSS properties take effect
    } else {
      currentCard.style.opacity = "0";
    }

    this._renderLeftDeck();
  };

  _renderLeftDeck = () => {
    const leftCardsCounterSpan = document.querySelector(
      "#remaining-cards-counter-number"
    );
    leftCardsCounterSpan.innerHTML = this.leftCardsCounter;

    const leftCardsContainer = document.querySelector("#remaining-deck");
    leftCardsContainer.innerHTML = "";

    for (let i = 0; i < this.leftCardsCounter; i++) {
      const offset = -i / 3;
      const cardReverseItem = document.createElement("img");
      cardReverseItem.src = `src/assets/${decksDict[this.type].reverse}`;
      cardReverseItem.alt = "reverse-card";
      cardReverseItem.style = `transform: translateX(${offset}px) translateY(${offset}px)`;
      cardReverseItem.key = `reverse-card-${i}`;
      leftCardsContainer.appendChild(cardReverseItem);

      if (i === this.leftCardsCounter - 1) {
        cardReverseItem.id = "last-reverse-card";
        cardReverseItem.addEventListener("click", () => this.pass());
      }
    }
  };

  cleanRender = () => {
    const previousCard = document.querySelector("#previous-card");
    const currentCard = document.querySelector("#current-card");
    const leftCardsCounterSpan = document.querySelector(
      "#remaining-cards-counter-number"
    );

    previousCard.src = "";
    previousCard.style.opacity = "0";
    currentCard.src = "";
    currentCard.style.opacity = "0";
    leftCardsCounterSpan.innerHTML = this.leftCardsCounter;
    this._renderLeftDeck();
  };

  appendCardToHistory = (card) => {
    const previousCardsContainer = document.querySelector(
      "#previous-cards-list"
    );
    const cardItem = document.createElement("img");
    cardItem.classList = "small-previous-card";
    cardItem.src = `src/assets/${card.image}`;
    cardItem.alt = card.name[this.language];
    cardItem.key = `card-${card.name[this.language]}`;
    previousCardsContainer.appendChild(cardItem);
  };

  cleanPassedCards = () => {
    const previousCardsContainer = document.querySelector(
      "#previous-cards-list"
    );
    previousCardsContainer.innerHTML = "";
  };

  reset = async () => {
    this.cards = this.suffle(decksDict[this.type].list);
    this.passedCards = [];
    this.cleanPassedCards();
    this.currentCard = null;
    this.leftCardsCounter = this.cards.length;
    this.cleanRender();
  };

  setLanguage = (language) => {
    this.language = language;
  };

  setType = (type) => {
    this.type = type;
    this.reset();
  };
}

export default Deck;
