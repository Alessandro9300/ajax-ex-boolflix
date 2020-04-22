// Trasformiamo il voto da 1 a 10 decimale in un numero intero da 1 a 5, così da permetterci di stampare a schermo un numero di stelle piene che vanno da 1 a 5, lasciando le restanti vuote (troviamo le icone in FontAwesome).
// Arrotondiamo sempre per eccesso all’unità successiva, non gestiamo icone mezze piene (o mezze vuote :P)
// Trasformiamo poi la stringa statica della lingua in una vera e propria bandiera della nazione corrispondente, gestendo il caso in cui non abbiamo la bandiera della nazione ritornata dall’API (le flag non ci sono in FontAwesome).
//
// Allarghiamo poi la ricerca anche alle serie tv. Con la stessa azione di ricerca dovremo prendere sia i film che corrispondono alla query, sia le serie tv, stando attenti ad avere alla fine dei valori simili (le serie e i film hanno campi nel JSON di risposta diversi, simili ma non sempre identici)


$(document).ready(function(){

  var queryButton = $("#button-search");
  var template = Handlebars.compile($("#info-movies").html())


  queryButton.click(function(){
    var queryVal = $("#input-search").val();
    $(".films").html("");
    $(".serie").html("");

    // chiamata ajax film
    $.ajax({
      url: "https://api.themoviedb.org/3/search/movie/",
      method: "get",
      data: {
        api_key: "81c480213993ff0316b1f525174620e3",
        query: queryVal,
        page: 1
      },
      success: function(data){
        var bandiera;
        var arrayResults = data.results;

        // if (arrayResults.length === 0){
        //   $(".films").html("<p id='no-results'> Nessun risultato trovato </p>")
        // } else {

          for (var i = 0; i < arrayResults.length; i++) {

            if (arrayResults[i].original_language == "it"){
              bandiera = '<img id="bandiera" src="img/italia.gif" alt="">'
            } else if (arrayResults[i].original_language == "en") {
              bandiera = '<img id="bandiera" src="img/inghilterra.png" alt="">';
            } else {
              bandiera = arrayResults[i].original_language;
            }

            var objTemplate = {
              titolo: arrayResults[i].title,
              titoloOriginale: arrayResults[i].original_title,
              lingua: bandiera,
              img: "https://image.tmdb.org/t/p/w220_and_h330_face" + arrayResults[i].poster_path,
              genere: "movie",
              voto: arrayResults[i].vote_average
            }

            if (arrayResults[i].poster_path == null){
              objTemplate.img = "img/question-mark.png"
            }

            var templateHtml = template(objTemplate);
            $(".films").append(templateHtml)

            votoStelle(arrayResults[i].vote_average, i, objTemplate.genere)

          }

        // }

      },

      error: function(richiesta, stato, errori){
        // alert(richiesta, stato, errori)
      }

    })


    // chiamata ajax serie tv
    $.ajax({
      url: "https://api.themoviedb.org/3/search/tv/",
      method: "get",
      data: {
        api_key: "81c480213993ff0316b1f525174620e3",
        query: queryVal,
        page: 1
      },
      success: function(data){

        var bandiera;
        var arrayResults = data.results;

        // if (arrayResults.length === 0){
        //   $(".films").html("<p id='no-results'> Nessun risultato trovato </p>")
        // } else {

          for (var i = 0; i < arrayResults.length; i++) {

            if (arrayResults[i].original_language == "it"){
              bandiera = '<img id="bandiera" src="img/italia.gif" alt="">'
            } else if (arrayResults[i].original_language == "en") {
              bandiera = '<img id="bandiera" src="img/inghilterra.png" alt="">';
            } else {
              bandiera = arrayResults[i].original_language;
            }

            var objTemplate = {
              titolo: arrayResults[i].name,
              titoloOriginale: arrayResults[i].original_name,
              lingua: bandiera,
              img: "https://image.tmdb.org/t/p/w220_and_h330_face" + arrayResults[i].poster_path,
              genere: "serie-tv",
              voto: arrayResults[i].vote_average
            }

            if (arrayResults[i].poster_path == null){
              objTemplate.img = "img/question-mark.png"
            }

            var templateHtml = template(objTemplate);
            $(".serie").append(templateHtml)

            votoStelle(arrayResults[i].vote_average, i, objTemplate.genere)

          }
        //
        // }

      },


      error: function(richiesta, stato, errori){
        // alert(richiesta, stato, errori)
      }

    })


    $("#input-search").val("");
  })

  function votoStelle(voto, ripetizioni, genere) {

    votoCeil = Math.round(voto / 2)
    numero = (ripetizioni + 1);

    for (var j = 0; j < votoCeil; j++) {

      $("." + genere + ":nth-child(" + numero +") .stelle").find(".fa-star:first-child").remove();

      $("."+ genere + ":nth-child(" + numero +") .stelle").append("<i class='fas fa-star'></i>")

    }
  }

})
