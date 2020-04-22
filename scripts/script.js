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
        console.log(arrayResults);

        if (arrayResults.length === 0){
          $(".films").html("<p id='no-results'> Nessun risultato trovato </p>")
        } else {

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
              voto: arrayResults[i].vote_average,
              img: "https://image.tmdb.org/t/p/w220_and_h330_face" + arrayResults[i].poster_path

            }

            console.log(objTemplate.img);



            if (arrayResults[i].poster_path == null){
              objTemplate.img = "img/question-mark.png"
            }

            var templateHtml = template(objTemplate);

            $(".films").append(templateHtml)

          }
        }

      },

      error: function(richiesta, stato, errori){
        // alert(richiesta, stato, errori)
      }

    })

    $("#input-search").val("");
  })













})
