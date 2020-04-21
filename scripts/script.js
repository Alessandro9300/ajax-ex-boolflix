// Creare un layout base con una searchbar (una input e un button) in cui possiamo scrivere completamente o parzialmente il nome di un film. Possiamo, cliccando il  bottone, cercare sull’API tutti i film che contengono ciò che ha scritto l’utente.
// Vogliamo dopo la risposta dell’API visualizzare a schermo i seguenti valori per ogni film trovato:
// Titolo
// Titolo Originale
// Lingua
// Voto


$(document).ready(function(){

  var queryButton = $("#button-search");
  var template = Handlebars.compile($("#info-movies").html())


  queryButton.click(function(){
    var queryVal = $("#input-search").val();
    $(".films").find(".movie").remove()
    $(".films").find("p").remove()

    $.ajax({
      url: "https://api.themoviedb.org/3/search/movie/",
      method: "get",
      data: {
        api_key: "81c480213993ff0316b1f525174620e3",
        query: queryVal,
        page: 1

      },
      success: function(data){

        var arrayResults = data.results;
        console.log(arrayResults);

        if (arrayResults.length === 0){
          $(".films").html("<p id='no-results'> Nessun risultato trovato </p>")
        } else {

          for (var i = 0; i < arrayResults.length; i++) {

            var objTemplate = {
              titolo: arrayResults[i].title,
              titoloOriginale: arrayResults[i].original_title,
              lingua: arrayResults[i].original_language,
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
