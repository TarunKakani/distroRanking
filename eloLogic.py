playerA = int(input("Rating Player A: "))
playerB = int(input("Rating Player B: "))

win = input("Who won: ")
k = 32 # standard
base_rating = 1200 # for new players

# give each player a base rating of 400

def calculateEa(playerA, playerB):
    exponent_ea = (playerB - playerA) / 400
    expected = 1 / (1 + pow(10, exponent_ea))

    return expected

def updateRatings(playerA , playerB, win, k):
    if (win == "A" or win == "a"):
        playerAScore = 1
        playerBScore = 0
    elif (win == "d" or win == "D" or win == "draw" or win == "Draw"):
        playerAScore = 0.5
        playerBScore = 0.5
    else:
        playerAScore = 0
        playerBScore = 1

    resA = calculateEa(playerA, playerB)
    resB = 1 - resA

    updateA = playerA + k * (playerAScore - resA)
    updateB = playerB + k * (playerBScore - resB)

    return round(updateA), round(updateB)

print(updateRatings(playerA, playerB, win, k))