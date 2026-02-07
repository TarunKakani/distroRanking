// the elo rating system
// Ea = 1/1 + 10^{(Rb - Ra) / 400}

// where
// Ea : the expected score (probability of winning) for player a
// Ra : the current rating of player a
// Rb : the current rating of player b

// 400 : is a scaling factor. This number ensures that a rating
// diff of 200 points implies a ~75% chance of winning for the
// higher rating player

// the elo ranking system doesn't award points for winning, it awards points based on the `likelihood of winning`.

// the main process/working of the algorithm
- before the match begins the algo calculates Ea.
- after the match you update the rating based on the actual score (Sa) where
- 1 for win, 0 for loss, 0.5 for draw

- R'a = Ra + K . (Sa - Ea)
- K is a volatility factor. Higher the K means ratings swing wildly (good for new players) and lower K means ratings are stable (good for established pros)