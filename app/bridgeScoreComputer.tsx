
export const calculateBridgePoints = (board) => {
    const level = parseInt(board.level, 10);
    const trump = board.trump;
    const vulnerability = board.vulnerability;
    const doubled = parseInt(board.doubled, 10);    
    const tricks = parseInt(board.tricks, 10);

    let points = 0;
    let base_score = 0;
    const contract_win = tricks >= 0;
    let vulnerable = vulnerability > 0;
    ///////////////////
    // Contrat gagné //
    ///////////////////

    if (contract_win) {
        if (trump === 'spade' || trump === 'heart') base_score = 30 * level; // Contrat en majeure
        else if (trump === 'diamond' || trump === 'club') base_score = 20 * level; // Contrat en mineur
        else base_score = 40 + (level - 1) * 30; // Contrat Sans-Atout


        if (base_score < 100)  points+= base_score+ 50; // Prime de partielle
         if (doubled == 1 ) points += base_score+50;  else if (doubled == 2) points += 100;

        // Calcul des points de base
        switch (doubled) {
            case 0: points +=  base_score + (tricks * (trump === 'spade' || trump === 'heart' || trump === 'SA' ? 30 : 20)); break;
            case 1: points += (base_score * 2) + (tricks * (100 * (vulnerable ? 2 : 1))); break;
            case 2: points += (base_score * 4)  + (tricks * (200 * (vulnerable ? 2 : 1)));  break;
            default: console.log("Invalid value for 'doubled'");
        }


        
        // Calcul des primes de manche et de chelem
        // Contrat en Mineur
        if (trump === 'club' || trump === 'diamond') {
            if (level > 4) points += vulnerable ? 500 : 300; 
            else if((level == 3 && doubled >= 1) || doubled == 2) points += vulnerable ? 500 : 300; 
            if (level === 6) points += vulnerable ? 750 : 500;  
            else if (level === 7) points += vulnerable ? 1500 : 1000; 
        }

        // Contrat en Majeur
        if (trump === 'spade' || trump === 'heart') {
            if (level >= 3 ) points += vulnerable ? 500 : 300; 
            else if((level == 2 && doubled >= 1) || doubled == 2) points += vulnerable ? 500 : 300; 
            if (level === 6) points += vulnerable ? 750 : 500;  
            else if (level === 7) points += vulnerable ? 1500 : 1000; 
        }

        // Contrat Sans-Atout
        if (trump === 'SA') {
            if (level >= 2) points += vulnerable ? 500 : 300; 
            if (level === 6) points += vulnerable ? 750 : 500;  
            else if (level === 7) points += vulnerable ? 1500 : 1000; 
        }

    ///////////////////
    // Contrat perdu //
    ///////////////////

    } else {
        if (vulnerable) {
            switch (doubled) {
                case 0: points = tricks * 100; break;
                case 1: points = tricks === -1 ? -200 : -200 + 300 * (tricks + 1); break;
                case 2: points = tricks === -1 ? -400 : -400 + 600 * (tricks + 1); break;
            }
        } else {
            switch (doubled) {
                case 0: points = tricks * 50; break;
                case 1: points = tricks === -1 ? -100 : (tricks === -2 || tricks === -3 ? -100 + 200 * (tricks + 1) : -500 + 300 * (tricks + 3)); break;
                case 2: points = tricks === -1 ? -200 : (tricks === -2 || tricks === -3 ? -200 + 400 * (tricks + 1) : -1000 + 600 * (tricks + 3)); break;
            }
        }
    }
    return points;
};