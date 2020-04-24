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

      funzioneApi(data, "Film");

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
        funzioneApi(data, "Serie-tv");
      },

      error: function(richiesta, stato, errori){
        // alert(richiesta, stato, errori)
      }

    })

    $("#input-search").val("");
  })

  function funzioneApi(arrayApi, tipo) {

    var arrayResults = arrayApi.results;

    for (var i = 0; i < arrayResults.length; i++) {

      var objTemplate = {
        lingua: bandiere(arrayResults[i].original_language),
        img: poster(arrayResults[i].poster_path),
        voto: votoStelle(arrayResults[i].vote_average),
        tipologia: tipo,
        trama: arrayResults[i].overview
      }

      if (tipo == "Film"){
        objTemplate.titolo = arrayResults[i].title;
        objTemplate.titoloOriginale = arrayResults[i].original_title;

      } else if (tipo == "Serie-tv"){
        objTemplate.titolo = arrayResults[i].name;
        objTemplate.titoloOriginale = arrayResults[i].original_name;
      }

      var templateHtml = template(objTemplate);
      $(".films").append(templateHtml)

    }

  }

  function votoStelle(voto) {

    votoCeil = Math.round(voto / 2)

    var stelline;

    for (var i = 0; i < 5; i++) {

      if (i < votoCeil){
        stelline += "<i class='fas fa-star'></i>"
      } else {
        stelline += "<i class='far fa-star'></i>"
      }

    }

    return stelline;

  }

  function bandiere(apiLingua){

    var outputBandiere;

    var lingue = ["it", "en", "es", "pt"];

    if (lingue.includes(apiLingua)){

      outputBandiere = '<img id="bandiera" src="img/' + apiLingua + '.png " alt="">'

      return outputBandiere

    }

    return apiLingua;

  }

  function poster(apiPoster){

    var locandina = "https://image.tmdb.org/t/p/w500" + apiPoster;

    if (apiPoster == null){
      locandina = "img/question-mark.jpg"
    }

    return locandina;

  }
// https://image.tmdb.org/t/p/w220_and_h330_face
})
