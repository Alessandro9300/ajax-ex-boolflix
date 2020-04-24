// Trasformiamo il voto da 1 a 10 decimale in un numero intero da 1 a 5, così da permetterci di stampare a schermo un numero di stelle piene che vanno da 1 a 5, lasciando le restanti vuote (troviamo le icone in FontAwesome).
// Arrotondiamo sempre per eccesso all’unità successiva, non gestiamo icone mezze piene (o mezze vuote :P)
// Trasformiamo poi la stringa statica della lingua in una vera e propria bandiera della nazione corrispondente, gestendo il caso in cui non abbiamo la bandiera della nazione ritornata dall’API (le flag non ci sono in FontAwesome).
//
// Allarghiamo poi la ricerca anche alle serie tv. Con la stessa azione di ricerca dovremo prendere sia i film che corrispondono alla query, sia le serie tv, stando attenti ad avere alla fine dei valori simili (le serie e i film hanno campi nel JSON di risposta diversi, simili ma non sempre identici)


$(document).ready(function(){
  var inputText = $("#input-search");
  var queryButton = $("#button-search");
  var template = Handlebars.compile($("#info-movies").html())

  //home film
  chiamataAjax("https://api.themoviedb.org/3/movie/popular/", 4, ".films");
  //home serie-tv
  chiamataAjax("https://api.themoviedb.org/3/tv/popular/", 4, ".films-2")
  //reload with logo
  $(".logo").click(function(){
    location.reload();
  })
  // comando con l'invio
  inputText.keypress(function(key){

    if (key.keyCode == 13){

      var queryVal = inputText.val();
      //pulisco tutto
      clearHome(queryVal);
      // chiamata ajax film
      chiamataAjax("https://api.themoviedb.org/3/search/movie/", 20, ".films",  queryVal, "Film");

      // chiamata ajax serie tv
      chiamataAjax("https://api.themoviedb.org/3/search/tv/", 20, ".films", queryVal, "Serie-tv");

      $("#input-search").val("");

    }

  })
  // comando con il click
  queryButton.click(function(){

    var queryVal = inputText.val();
    //pulisco tutto
    clearHome(queryVal);
    // chiamata ajax film
    chiamataAjax("https://api.themoviedb.org/3/search/movie/", 20, ".films",  queryVal, "Film");

    // chiamata ajax serie tv
    chiamataAjax("https://api.themoviedb.org/3/search/tv/", 20, ".films", queryVal, "Serie-tv");

    $("#input-search").val("");
  })

  //funzione per appendere l'api nell'html
  function funzioneApi(arrayApi, tipo, numeroCicli, appendi) {

    var arrayResults = arrayApi.results;

    for (var i = 0; i < numeroCicli; i++) {

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
      $(appendi).append(templateHtml)

    }

  }
  //funzione per transformare il voto in stelle
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
  //funzione per generare le bandiere
  function bandiere(apiLingua){

    var outputBandiere;

    var lingue = ["it", "en", "es", "pt"];

    if (lingue.includes(apiLingua)){

      outputBandiere = '<img id="bandiera" src="img/' + apiLingua + '.png " alt="">'

      return outputBandiere

    }

    return apiLingua;

  }
  //funzione per generare la copertina
  function poster(apiPoster){

    var locandina = "https://image.tmdb.org/t/p/w500" + apiPoster;

    if (apiPoster == null){
      locandina = "img/question-mark.jpg"
    }

    return locandina;

  }
  //funzione per fare la chiamata ajax
  function chiamataAjax(url, numeroCicli, appendi, queryVar, tipo) {
    $.ajax({
      url: url,
      method: "get",
      data: {
        api_key: "81c480213993ff0316b1f525174620e3",
        query: queryVar,
        page: 1
      },
      success: function(data){

      funzioneApi(data, tipo, numeroCicli, appendi);

      },

      error: function(richiesta, stato, errori){
        // alert(richiesta, stato, errori)
      }

    })

  }
  //funzion per clearare la home quando si cerca qualcosa
  function clearHome(val){
    $(".films").html("");
    $(".intesta-2").remove();
    $(".films-2").remove();
    $(".intesta").html("Ecco i risultati per: " + val)
  }

})
