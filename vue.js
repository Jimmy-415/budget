
/* Les variables  */

var donneeVue = {
    dateDuJourEditee : "",
    dateDuJour : new Date(),
    listeDepenses : [],
    listeRentrees : [],
    rentreeDeReference : null,
    soldeCompte : 0,
    resultatVerificationProvision : " "
};

/* Les fonctions */

function editionDate(date){
    return date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear(); /* getDay renvoit le jout de la semaine (0-->6) !!!! */
}

const calculTotalMensuelDepenses = function(){
    var total = 0;
    for(var i = 0, j = donneeVue.listeDepenses.length ; i < j ; i++){
        if(donneeVue.listeDepenses[i].frequence === "mensuel"){
            total += (donneeVue.listeDepenses[i].montant * 12)
        }
        else{
            if(donneeVue.listeDepenses[i].frequence === "annuel"){
                total += donneeVue.listeDepenses[i].montant;
            }
        }
    }
    return total;
};

const calculTotalMensuelRentrees = function(){
    var total = 0;
    for(var i = 0, j = donneeVue.listeRentrees.length ; i < j ; i++){
        total += (donneeVue.listeRentrees[i].montant * 12)
    }
    return total;
};

const calculProvisionsEnDateDeReference = function(){
    let provisionsEnDateDeReference = 0;
    for(var i = 0, j = donneeVue.listeDepenses.length ; i < j ; i++ ){
        provisionsEnDateDeReference += donneeVue.listeDepenses[i].montantBudgetise();
    }
    for(var i = 0, j = donneeVue.listeRentrees.length ; i < j ; i++){
        provisionsEnDateDeReference -= donneeVue.listeRentrees[i].montant;
    }
    return provisionsEnDateDeReference;
};

const initialisationVue = function(){
    donneeVue.dateDuJourEditee = editionDate(donneeVue.dateDuJour);
};

const checkProvision = function(){
    /* if(donneeVue.soldeCompte === ) provisionsEnDateDeReference */
};

function calculEcheance(frequence, jour, mois){
    let dateCalculee;
    switch (frequence){
        case "mensuel" :
            dateCalculee = new Date(donneeVue.dateDuJour.getFullYear(), donneeVue.dateDuJour.getMonth(), jour);
            if (dateCalculee <= donneeVue.dateDuJour){
                if(donneeVue.dateDuJour.getMonth() < 11){
                    dateCalculee = new Date(donneeVue.dateDuJour.getFullYear(), donneeVue.dateDuJour.getMonth() + 1, jour);
                }
                else{
                    dateCalculee = new Date(donneeVue.dateDuJour.getFullYear() + 1, 0, jour);
                }
            }
            break;

        case "trimestriel" :
            var i = 0;
            var j = mois.length;
            while(i < j && (mois[i] - 1) < donneeVue.dateDuJour.getMonth()){
                i++;
            }
            if (i > j){
                dateCalculee = new Date(2099, 11, 31);
            }
            else{
                dateCalculee = new Date(donneeVue.dateDuJour.getFullYear(), mois[i] - 1, jour);
                if(dateCalculee <= donneeVue.dateDuJour){
                    if(i === (mois.length - 1)){ /* Dernière occurrence */
                        dateCalculee = new Date(donneeVue.dateDuJour.getFullYear() + 1, mois[0] - 1, jour);
                    }
                    else{
                        dateCalculee = new Date(donneeVue.dateDuJour.getFullYear(), mois[i + 1] - 1, jour);
                    }
                }
            }
            break;

        case "annuel" :

            dateCalculee = new Date(donneeVue.dateDuJour.getFullYear(), mois[0] - 1, jour);
            if(dateCalculee <= donneeVue.dateDuJour){
                dateCalculee = new Date(donneeVue.dateDuJour.getFullYear() + 1, mois[0] - 1, jour);
            }
            break;

        default :
            dateCalculee = new Date(2099, 11, 31);
    }
    return dateCalculee;
}

function calculMontantBudgetise(dateDeSimulation, dateEcheance, frequence, montant){
    let nbJoursAnnee = 365;
    let nbJoursBudgetises = 0;
    let montantBudgetise = 0;
    switch (frequence){
        case "mensuel" :
            montantBudgetise = montant;
            break;

        case "annuel" :
            if(dateEcheance >= dateDeSimulation){
                nbJoursBudgetises = nbJoursAnnee - dayDiff(dateDeSimulation, dateEcheance);
            }
            else{
                nbJoursBudgetises = nbJoursAnnee - dayDiff(dateEcheance, dateDeSimulation);
            }
            montantBudgetise = (montant * nbJoursBudgetises) / nbJoursAnnee ;
            break;

        case "trimestriel" :
            if(dateEcheance >= dateDeSimulation){
                nbJoursBudgetises = (nbJoursAnnee / 4) - dayDiff(dateDeSimulation, dateEcheance);
            }
            else{
                nbJoursBudgetises = (nbJoursAnnee / 4) - dayDiff(dateEcheance, dateDeSimulation);
            }
            montantBudgetise = (montant * nbJoursBudgetises) / (nbJoursAnnee / 4) ;
            break;
        default :
            break;
    }
    return Math.round(montantBudgetise);
}

function dayDiff(d1, d2)
{
    d1 = d1.getTime() / 86400000;
    d2 = d2.getTime() / 86400000;
    return new Number(d2 - d1).toFixed(0);
}

const fonctionComparaisonDepense = function(depense1, depense2){
  if (depense1.montantBudgetMensualise() > depense2.montantBudgetMensualise()){
      return -1;
  }
  else{
      return 1;
  }
};

const calculMontantBudgetMensualise = function(frequence, montant){
    switch (frequence){
        case "mensuel" :
            return Math.round(montant);
            break;

        case "trimestriel" :
            return Math.round(montant / 4);
            break;

        case "annuel" :
            return Math.round(montant / 12);
            break;

        default :
            return Math.round(montant);
    }
};
/* Les classes de fonction */

const Depense = function(categorie, frequence, description, montant, jour, mois){
  this.categorie = categorie;
  this.frequence = frequence;
  this.description = description;
  this.montant = montant;
  this.jour = jour;
  this.mois = mois;
  this.prochaineEcheance = function(){
      return calculEcheance(this.frequence, this.jour, this.mois);
  };
  this.prochaineEcheanceEditee = function(){
      return editionDate(this.prochaineEcheance());
  };
  this.montantBudgetise = function(){
      return calculMontantBudgetise(donneeVue.rentreeDeReference.prochaineEcheance(), this.prochaineEcheance(), this.frequence, this.montant);
    };
  this.montantBudgetMensualise = function(){
      return calculMontantBudgetMensualise(this.frequence, this.montant);
  };
};

/* Eau ???  Appels de fonds trimestriel ??? */
donneeVue.listeDepenses.push(new Depense("crèche","mensuel", "Crèche", 350, 1, [5]));
donneeVue.listeDepenses.push(new Depense("epargne","mensuel", "Compte épargne", 1000, 25, [5]));
donneeVue.listeDepenses.push(new Depense("epargne","mensuel", "KEYPRIVATE", 500, 2, [5]));
donneeVue.listeDepenses.push(new Depense("epargne","mensuel", "KEYPLAN Jimmy", 50, 2, [5]));
donneeVue.listeDepenses.push(new Depense("epargne","mensuel", "KEYPLAN Quentin", 50, 2, [5]));
donneeVue.listeDepenses.push(new Depense("maison","mensuel", "Prêt maison", 1095, 2, [5]));
donneeVue.listeDepenses.push(new Depense("dépense","mensuel", "VISA", 750, 2, [5]));
donneeVue.listeDepenses.push(new Depense("auto","mensuel", "Assurance auto", 90, 3, [5]));
donneeVue.listeDepenses.push(new Depense("maison","mensuel", "Part électricité", 90, 7, [5]));
donneeVue.listeDepenses.push(new Depense("GSM","mensuel", "GSM", 10, 25, [5]));
donneeVue.listeDepenses.push(new Depense("internet","mensuel", "Proximus ADSL", 25, 15, [5]));
donneeVue.listeDepenses.push(new Depense("appartement","trimestriel", "Provisions charges", 404, 17, [1, 4, 7, 10]));
donneeVue.listeDepenses.push(new Depense("maison","trimestriel", "Eau", 50, 15, [3, 6, 9, 12]));
donneeVue.listeDepenses.push(new Depense("appartement", "annuel", "Remboursement charges appartement", 533, 9, [5]));
donneeVue.listeDepenses.push(new Depense("appartement", "annuel", "Impôts Belgique", 903, 5, [2]));
donneeVue.listeDepenses.push(new Depense("auto", "annuel", "Taxe auto", 244, 11, [5]));
donneeVue.listeDepenses.push(new Depense("maison", "annuel", "Assurance Lottert", 335, 16, [2]));
donneeVue.listeDepenses.push(new Depense("maison", "annuel", "Gaz", 600, 20, [2]));
donneeVue.listeDepenses.push(new Depense("maison", "annuel", "CMCM", 195, 19, [12]));
donneeVue.listeDepenses.push(new Depense("maison", "annuel", "Taxe poubelles", 126, 19, [9]));
donneeVue.listeDepenses.push(new Depense("appartement", "annuel", "Revenu cadastral appartement", 1186, 19, [9]));
donneeVue.listeDepenses.push(new Depense("maison", "annuel", "Revenu cadastral Lottert", 552, 19, [9]));
donneeVue.listeDepenses.push(new Depense("santé", "annuel", "Mutuelle", 150, 19, [1]));

donneeVue.listeDepenses.sort(fonctionComparaisonDepense);

const Rentree = function(categorie, description, montant, jour){
  this.categorie = categorie;
  this.description = description;
  this.montant = montant;
  this.jour = jour;
  this.prochaineEcheance = function(){
      return calculEcheance("mensuel", this.jour, null);
  };
  this.prochaineEcheanceEditee = function(){
      return editionDate(this.prochaineEcheance());
  };
};
donneeVue.rentreeDeReference = new Rentree("salaire", "Salaire SCS", 3750, 28);
donneeVue.listeRentrees.push(donneeVue.rentreeDeReference);
donneeVue.listeRentrees.push(new Rentree("allocation", "Allocation Quentin", 132, 28));
donneeVue.listeRentrees.push(new Rentree("loyer", "Loyer brut Arlon", 930, 3));

/* Mon application Vue.js */

const app = new Vue(
    {
        el : "#app",
        data : donneeVue,
        computed : {
            totalMensuelDepenses : calculTotalMensuelDepenses,
            totalMensuelRentrees : calculTotalMensuelRentrees,
            provisionsEnDateDeReference : calculProvisionsEnDateDeReference,
        },
        methods : {verificationProvision : checkProvision},
        created : initialisationVue
    }
);