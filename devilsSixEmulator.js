const SUITS = ['\u2660','\u2665','\u2666','\u2663'];
const RANKS = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];
const RVAL  = { A:1, J:11, Q:12, K:13 };
for (let i=2;i<=10;i++) RVAL[i]=i;

class Card {
  constructor(suit, rank){
    this.suit = suit;
    this.rank = rank;
    this.value = RVAL[rank];
    this.faceUp = false;
  }
}

function buildDeck(){
  const temp = [];
  for (let d=0; d<2; d++){
    for (const s of SUITS){
      for (const r of RANKS){
        temp.push(new Card(s,r));
      }
    }
  }
  for (let i=temp.length-1; i>0; i--){
    const j = Math.floor(Math.random()*(i+1));
    [temp[i], temp[j]] = [temp[j], temp[i]];
  }
  return temp;
}

function drawDevilsSixFromDeck(deck){
  const cards = [];
  for (let i=0;i<6;i++){
    const c = deck.pop();
    c.faceUp = true;
    cards.push(c);
  }
  return cards;
}

function isDevilsSixUnwinnable(cards){
  const suitOrder = {};
  for (let i=cards.length-1;i>=0;i--){
    const card = cards[i];
    if (!suitOrder[card.suit]) suitOrder[card.suit] = [];
    suitOrder[card.suit].push(card.value);
  }

  for (const ordered of Object.values(suitOrder)){
    if (ordered.length < 2) continue;

    const sorted = ordered.slice().sort((a,b)=>a-b);
    for (let i=0;i<sorted.length;i++){
      const a = sorted[i];
      for (let j=i+1;j<sorted.length;j++){
        const b = sorted[j];
        if (b - a <= 2) return true;
        if (b - a > 2) break;
      }
    }
  }

  return false;
}

function repairDevilsSix(cards, deck){
  for (let i=0;i<cards.length;i++){
    const original = cards[i];
    const originalFace = original.faceUp;
    for (let j=0;j<deck.length;j++){
      const replacement = deck[j];
      const replacementFace = replacement.faceUp;
      cards[i] = replacement;
      replacement.faceUp = true;
      original.faceUp = false;
      if (!isDevilsSixUnwinnable(cards)){
        deck[j] = original;
        return true;
      }
      cards[i] = original;
      original.faceUp = originalFace;
      replacement.faceUp = replacementFace;
    }
    cards[i] = original;
    original.faceUp = originalFace;
  }
  return false;
}

function preparePlayableDevilsSix(){
  const MAX_ATTEMPTS = 5000;
  let attempt = 0;
  let candidate = [];
  let deck = [];
  let repaired = false;
  while (attempt < MAX_ATTEMPTS){
    deck = buildDeck();
    candidate = drawDevilsSixFromDeck(deck);
    if (!isDevilsSixUnwinnable(candidate)){
      return { deck, devilsSix: candidate, attempts: attempt + 1, repaired };
    }
    attempt++;
  }

  repaired = repairDevilsSix(candidate, deck);
  return { deck, devilsSix: candidate, attempts: MAX_ATTEMPTS, repaired };
}

function dealTableau(deck){
  const tableau = new Array(10).fill(0).map(()=>[]);
  const downs = [0,1,2,3,4,4,3,2,1,0];
  for (let col=0; col<10; col++){
    for (let d=0; d<downs[col]; d++){
      const c = deck.pop();
      c.faceUp = false;
      tableau[col].push(c);
    }
    const up = deck.pop();
    up.faceUp = true;
    tableau[col].push(up);
  }
  return tableau;
}

function simulateDeals(iterations){
  let repairedCount = 0;
  let totalAttempts = 0;
  for (let i=0;i<iterations;i++){
    const { deck, devilsSix, attempts, repaired } = preparePlayableDevilsSix();
    totalAttempts += attempts;
    if (repaired) repairedCount++;
    if (isDevilsSixUnwinnable(devilsSix)){
      throw new Error('Unwinnable Devil\'s Six slipped through');
    }
    const tableau = dealTableau(deck);
    if (tableau.some(col => col.length === 0)){
      throw new Error('Invalid tableau column length detected');
    }
  }
  return { repairedCount, totalAttempts };
}

const ITERATIONS = 10000;
const start = Date.now();
const { repairedCount, totalAttempts } = simulateDeals(ITERATIONS);
const duration = Date.now() - start;
console.log(JSON.stringify({
  iterations: ITERATIONS,
  repairedCount,
  totalAttempts,
  avgAttempts: totalAttempts / ITERATIONS,
  durationMs: duration
}, null, 2));
