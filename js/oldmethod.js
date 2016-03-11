

//*****************************
// OLD METHODS PARA COPIAR

//*****************************
//*****************************
//*****************************
//*****************************
//*****************************
//*****************************
//*****************************
//*****************************
//*****************************
//*****************************
//*****************************
//*****************************
//*****************************
//*****************************
//*****************************
//*****************************
//*****************************
//*****************************
//*****************************
//*****************************
//*****************************
//*****************************
//*****************************


var ml=function (){} ;
ml.prototype.search=function(ex){
		var pl = 'private';
		console.log('prv:'+ pl);
		console.log('ex:'+ ex.newprop);
		console.log(this.newprop);
		console.log(this);
}

function myt(){
var t = new ml;
ml.newprop = 'newproperty de ml';
t.newprop = 'newproperty de t';
//console.log(t.search(ml));
//console.log(t.search('ccc'));
}

//*********************
// listado object
//**********************
var listado = function(){
	this.items = new Array();
};
listado.prototype.search = function(stack,field,item){

	if(this.hasOwnProperty(stack)){
		var rdc = function l(fld,itm,stk,i){
			if(i == stk.length){
				return  ;
			}else{
				if(stk[i][fld] == itm){
					return i;
				}else{
					return l(fld,itm,stk,i+1);
				}
			}
		}
		return rdc(field,item,this[stack],0);
	}
	}


var part_item = function(){};
part_item.prototype.set = function(o){
	this.name = o.name;
	this.PTO_id = o.PTO_id;
	this.price = o.value;
	this.hasfoto = o.hasfoto;
}



var constants={'user_acces_see_prices': 4 };
var cart = new listado;
var parts = new listado;
var r_orders = {};




/**/

//*********************
// FRONT END METHODS PARA PARTICLES
//**********************

/*
* PART SHOW FOR EDITION
*/
function pcle_show(id){
	var d = {'id':id};
	$.ajax({
		type : "POST",
		url : "particle/show",
		data:d,
		dataType:"text",
		success : function(m) {
		//	console.log(m);
			if(m){
				//console.log(m);
				$('#myModalLabel').html('Editing Part');
				$('#modal_content').html(m);
				$('#myModal').modal({keyboard: false});
			}else{
				alert("FAIL");
			}
		},
		error : function(xhr, ajaxOptions, thrownError) {
			alert(thrownError);
		}
	});
}
/*
*
* CONTROLA CUALES CAMPOS SON CAMBIADOS PARA ACTUALIZAR SOLO LOS NECESARIOS
*/
function updater_control(ob){
	var nv = {'lbl':ob.id,'val':ob.value};
	$('#changed_ipts').val($('#changed_ipts').val()+'-'+JSON.stringify(nv));
	//console.log($('#changed_ipts').val());
}
/*
*
*  HACE UPDATE RECORD
*/
function update_record(rec_id){
	// por cada campo en el form (on change)
	// recibo id del record por param
	// validar campo
	//llamar a cpanel/update_record
	// buscar pcle con ese id
	// si esta update si no esta insert pcle
	// poner loader icon a lado del campo
	var id = true;
	var c = false;
	var l = [];
	if($('#changed_ipts').val() !=''){
		var upd = JSON.stringify({'rec_id':rec_id})+'-'+ $('#changed_ipts').val();
		//console.log(rec_id);
		var uparr = upd.split('-');
		//uparr.push();
		//console.log(uparr);

		if(id){
			myAlertLoader('show');
			var mydata = {'data': uparr};
			$.ajax({
				type : "POST",
				url : "particle/update_part",
				data : mydata,
				dataType : "text",
				success : function(retdata) {
					//console.log(retdata);
					if(retdata){
						$('#changed_ipts').val('');
						myAlertLoader('success', 'Record Updated...');
					}else{
						myAlertLoader('failed', 'Falied to update record...')
					}


				},
				error : function(xhr, ajaxOptions, thrownError) {
					alert(thrownError);
				}
			});
		}
	}else{
		myAlertLoader('Warning', 'Nothing to update');
	}

}



//*********************
// FRONT END METHODS PARA CATALOGS
//**********************

/****************************************************
*CONTROLLER DE LOS SELECTORES, RESUELVE A QUE FUNCIONES LLAMAR Y MANTIENE LIMPIA LA PANTALLA
*****************************************************/


function controler(item,selector,name,rqtor){
	// ********LIST UPDATES CHEKEO FOR UPDATES DEL CART
	//ccontrol();
	$('#listado').html('');
    $('#foto').html('');
    switch(selector) {
    case 'part_num':
    	$('#products').val('');
    	$('#id_strokes').val('');
    	$('#potencia').val('').attr('placeholder','');
    	$('#sector').val('').attr('placeholder','');
    	get_part({'engine_id': item,'rqtor':rqtor,'selector':selector});
    	break;
    case 'product':
    	$('#pn').val('');
    	$('#products').val(name);
    	$('#id_strokes').val(item);
    	$('#potencia').val('');
    	$('#sector').val('');
    	get_potencias(item)
    	break;
    case 'model':
        $('#potencia').val(name);
        $('#id_pot').val(item);
        $('#sector').val('');
        get_sectores(item);
        break;
    case 'sector':
        $('#sector').val(item);
        get_part({'id_pot':$.trim($("#id_pot").val()),'sector':$.trim(item),'rqtor':rqtor,'selector':'sector'});
        break;
   }

}

//********************
// methods para el cheker
//*********************
/*
 *NO ESTA EN USO
 *obtiene la cookie del param , desde doc.cookie
 */
function getCookie(cname) {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i].trim();
		if (c.indexOf(name) == 0)
			return c.substring(name.length, c.length);
	}
	return "";
}


/**************************************
*  DEL AUTOCOMPLETE
***************************************/
function sugest_partnum(){
    var availableTags = array();
    $( "#pn" ).autocomplete({
      source: availableTags,

    });
  }



// x : id del motor || r : requestor || s : selector que hace el pedido (part_num o potencia/sector)
/**************************************
*  LLAMA AL PHP PARA OBTENER DATOS DE PARTE
***************************************/
function get_part(x) {
	if(x){
		myAlertLoader('show');
		$.ajax({
			type : "POST",
			url : "catalogs/get_part",
			data : x,
			dataType : "json",
			success : function(d) {
				console.log(d);
				window[d.action](d);
				myAlertLoader('hide');

			},
			error : function(xhr, ajaxOptions, thrownError) {
				console.log('err:',xhr)
				myAlertLoader('failed',thrownError);
			}
		});
	}
}


/***********************************************************************
* RELLENA EL SELECTOR DE potencias  SEGUN STROKES 2,4 O 6 PARA LA MOTO *
***********************************************************************/
function get_potencias(p){
	$('#hloader').show()
	$('#potencia').val('');
	var md = {'id_strokes':p};
	$.ajax({
		type : "POST",
		url : "catalogs/get_potencias",
		data : md,
		dataType : "json",
		success : function(retdata) {
			$('#sel_potencias').empty();
			for (var i = 0; i < retdata.length; i++) {
				$('#sel_potencias').append("<li><a href=JavaScript:controler(\'"+retdata[i].id_potencia_marca+"\',\'model\',\'"+retdata[i].name+ "\')> "+retdata[i].name+"</a></li>")
			};
			$('#pots_button').focus();
			$('#potencia').attr('placeholder','Select model');
			$('#hloader').hide()
			//console.log(retdata);
		},
		error : function(xhr, ajaxOptions, thrownError) {
			myAlertLoader('failed',thrownError);
		}
	});

}

/*************************************************
* RELLENA EL SELECTOR DE SECTORES SEGUN EL MODELO
**************************************************/
function get_sectores(s){
	//console.log(s);
	$('#hloader').show()
	$('#sector').val('');
	var md = {'id_pot':s};
	$.ajax({
		type : "POST",
		url : "catalogs/get_sectores",
		data : md,
		dataType : "json",
		success : function(retdata) {
			$('#sel_sectors').empty();
			for (var i = 0; i < retdata.sectors.length; i++) {
				//console.log("<li><a href=JavaScript:controler(\'"+retdata.sectors[i].sector+"\',\'sector\',\'\',\'"+retdata.rqtor+"\')>"+retdata.sectors[i].sector+"</a></li>")
				//console.log('ret- get_sectores:',retdata);
				$('#sel_sectors').append("<li><a href=JavaScript:controler(\'"+retdata.sectors[i].sector.trim()+"\',\'sector\',\'\',\'"+retdata.rqtor.trim()+"\')>"+retdata.sectors[i].sector.trim()+"</a></li>")
			};
			$('#sectors_button').focus();
			$('#sector').attr('placeholder','Select Sector');
			$('#hloader').hide()
		},
		error : function(xhr, ajaxOptions, thrownError) {
			myAlertLoader('failed',thrownError);
		}
	});
}


/*************************************
VENTANA DE MENSAJES Y LOADER DEL AJAX
**************************************/
function myAlertLoader(state, msg){
	var res=true;
	if (typeof(msg)==='undefined') msg = '';
	switch(state){
		case 'ask':
		$.fancybox("<div style='width:250px;margin-top:23px;'><div class='alert alert-success' role='alert'><button type='button' onClick=myAlertLoader('hide') class='close' aria-label='Close'><span aria-hidden='true'>&times;</span></button><strong>Success!&nbsp;</strong>"+msg+"</div></div>", {
				modal : true,
				});
		break;
		case 'show':
		$.fancybox("<div style='margin:20px;'><img src='/ciparts/images/ajax-loader.gif' width='60' height='60' /></div>", {
				modal : true,
				});
		break;
		case 'hide':
		$.fancybox.close();
		break;
		case 'success':
		$.fancybox("<div style='width:250px;margin-top:23px;'><div class='alert alert-success' role='alert'><button type='button' onClick=myAlertLoader('hide') class='close' aria-label='Close'><span aria-hidden='true'>&times;</span></button><strong>Success!&nbsp;</strong>"+msg+"</div></div>", {
				modal : true,
				});
		break;
		case 'warning':
		$.fancybox("<div style='width:250px;margin-top:23px;'><div class='alert alert-warning' role='alert'><button type='button' onClick=myAlertLoader('hide') class='close' aria-label='Close'><span aria-hidden='true'>&times;</span></button><strong>Warning!&nbsp;</strong>"+msg+"</div></div>", {
				modal : true,
				});
		break;
		case 'failed':
		$.fancybox("<div style='width:250px;margin-top:23px;'><div class='alert alert-danger' role='alert'><button type='button' onClick=myAlertLoader('hide') class='close' aria-label='Close'><span aria-hidden='true'>&times;</span></button><strong>Failed!&nbsp;</strong>"+msg+"</div></div>", {
				modal : true,
				});
		break;

	}
	return res;
}

/***********************************************
* es vieja ESCRIBE EL CONTENIDO DEL LISTADO DE PARTES
************************************************/
function write_plist(lstline,index){
	var p = new part_item()
	p.set(lstline.items[index]);
	parts.items.push(p);
	$('#list_table').append("<tr id=\'l_"+index+"\' onMouseOver=highlight(\'"+index+"\',\'number_"+lstline.items[index].refnum+"\') onMouseOut=highlight_rem(\'"+index+"\')><td>"+lstline.items[index].refnum+"</td><td id=\'PTO_"+index+"\'>"+p.PTO_id+"</td><td>"+p.name+ "</td>"+((lstline.items[index].hasfoto === true)?"<td><button onClick=show_foto(\'"+lstline.items[index].PTO_id+"\',\'"+lstline.items[index].name.split(' ').join('_')+"\') type='button' class='btn btn-sm btn-default'><span class='glyphicon glyphicon-camera' aria-hidden='true'></span></button></td>":"<td></td>")+" "+((lstline.requestor.user_acces < constants.user_acces_see_prices)?"<td>"+p.price+"</td>" :"")+"<td><a href='#'><button id=\'buybot_"+index+"\' onClick=ad_to_cart(\'"+index+"\',\'select\') type='button' class='btn btn-sm btn-default'><span id=\'icon_"+index+"\' class='glyphicon glyphicon-shopping-cart' aria-hidden='true'></span></button><span id=\'cant_"+index+"\' style='display:none;margin:7px;'><input id=\'inputcant_"+index+"\' type='number' min='1' max='99' step='1' value=1 onBlur=update_cart(this.id,parts)  onChange=check_cant(this.id,parts) onKeyPress=check_enter(this.id) ></span></a></td></tr>");
    var f = itmInCartQty(p.PTO_id);
    if(f > 0){
    	$('#inputcant_'+index).val(f);
    	ad_to_cart(index,'retrieve');
    }
}

function list_with_exploded_image(src){
	 	// ***********GUARDA LA SELECCION PARA HACER BOTON DE BACK
   	windoTOP.parts_for_bak = src ;
  	windoTOP.parts_for_bak.last_selected ={'part_num':$('#pn').val(),'products':$('#products').val(),'potencia':$('#potencia').val(),'sector':$('#sector').val()};
    // *****************************************************
		// cleaningprevious lists / selections in screen
		clean('cart_list');
		clean('part_list');
		//limpio el array de la lista de partes
		parts.items = [];
		// defino si mostrar o no los precios segun el tipo de usuario (Guest o Registrado)
		var showPrices = (src.requestor.user_acces < constants.user_acces_see_prices)? true : false;
	/****************************
	*  PREPARA EL CONTENIDO DE LA TABLE CON LISTA DE PARTES
	*****************************/
		//var panelHeading = 'Product: '
		var panelHeading = ' Engine:\x20'+src.items[0].potencia + '\0\xa0  \0\xa0|\x20 Strokes :'+ src.items[0].strokes+'\0\xa0  \0\xa0|\x20 Sector:\x20'+ src.items[0].sector ;
		var tblHeading = (showPrices)?['Ref #','Part Code','Description','Img','Price','Buy'] :['Ref #','Part Code','Description','Img','Quote'];

		//CARGO EL ARRAY RES CON LOS ITEMS EN SRC QUE ES EL RESULTADO DEL QUERY "PEDIDO DE PARTES" ARMADO CON LOS SELECTORES
		var res = [];
		src.items.map(function(itm,index){
			var p = new part_item()
			p.set(itm);
			parts.items.push(p);
					// content [{'attrib':[],'items':[{'content':'','attrib':[]}]}]
			if(showPrices){
				var c = {'attrib':[
								{'id':'l_'+index},
								{'onMouseOver':"highlight(\'"+ index+"\',\'number_"+itm.refnum+"\')"},
								{'onMouseOut':"highlight_rem(\'"+index+"\')"}
							],
						'items':[
							{'content':itm.refnum},
							{'content':itm['PTO_id'],'attrib':[{'id':'PTO_'+index,}]},
							{'content':itm['name']},
							{'content':showFotoButton(itm,index)},
							{'content':itm['value']},
							{'content':showBuyButton(index)}
						]
					}
			}else{
				var c = {'attrib':[
								{'id':'l_'+index},
								{'onMouseOver':"highlight(\'"+ index+"\',\'number_"+itm.refnum+"\')"},
								{'onMouseOut':"highlight_rem(\'"+index+"\')"}
							],
						'items':[
							{'content':itm.refnum},
							{'content':itm['PTO_id'],'attrib':[{'id':'PTO_'+index,}]},
							{'content':itm['name']},
							{'content':showFotoButton(itm,index)},
							{'content':showBuyButton(index)}
						]
					}
			}
			res.push(c)
		});
		// el panel que contiene la tabla
		mk_panelWithHeading('partslist',[{'style':'max-height:600px;overflow:auto;'},{'class':'col-md-6'}],panelHeading,'','listado');
		// hace la tabla params-> id de la tabla,headings,contenido(array con los td's),parent_donde se aloja la tabla)
		mk_table('list_table',tblHeading,res,'content_partslist');
		//vuelvo a mapear src para insertar los prodUCTOS SELECCIONADOS EN EL CART SI LOS HAY
		markInCartItems(src.items);
	 // EXPLODED IMAGE
	 	$('#pnlBody_partslist').append("<div id=\"foto-container\" style = \'max-height:600px;overflow:auto;\' class = \'col-md-6\' ><img  id=\"explode_img\" src=\'images/"+src.items[0].potencia.replace('/','-')+"/"+src.items[0].sector+".jpg\' onError=\"this.onerror=null;this.src=\'images/imgplc.jpg\';\" width=\"600\" usemap=\"#vista\"/><map id=\'vista\' name=\"vista\">");
		// crea el mapa de los mouse over de los numeros en la exploded view
		$('#explode_img').load(function(){map_maker(src,0);});
}

/***********************************************
* END LISTADO DE PARTES
************************************************/


/***********************************************
* PONE EN EL LISTADO LOS PRODUCTOS QUE ESTAN EN EL CARRO SI ENCUENTRA EL PTO_id
************************************************/
function markInCartItems(currentList){
	currentList.map(function(item,i){
		windoTOP.cart.items.map(function(ci){
			if(ci.PTO_id === item.PTO_id){
				$('#inputcant_'+i).val(ci.qty);
				ad_to_cart(i,'retrieve');
				};
		})
	});
}



/**************************
*FUNCIONES CARRO DE COMPRAS
**************************/

//recibe un nombre de elemento y devuelve el index number en cart de esa linea del listado
function find_PTO_id_index_incart(elem){
	//curent Element Index *****
	var i = elem.substring(elem.indexOf('_')+1);
	// PTO_id del current index
	var current_line_pto_id = $('#PTO_'+i).html();
	return cart.search('items','PTO_id',current_line_pto_id);
}

// muestra el carro de sesiones anteriores
function cart_setup(cart,userdata){
		windoTOP.cart.items = cart;
		windoTOP.cart.rqtor = userdata;
		//console.log("cart_setup");
		console.log('cart_setup:',windoTOP.cart);
		cart_buton_showhide(cart.length);
}

/*********************************************
* AGREGO UN ITEM AL la lista de COMPRAS local
**********************************************/
function ad_to_cart(ln,type) {
	switch(type){
		case 'retrieve':
			$('#l_'+ln).css({'background-color' : '#2B952C'});
			$('#icon_'+ln).removeClass('glyphicon glyphicon-shopping-cart').addClass('glyphicon glyphicon-ok');
			$('#cant_'+ln).show();
		break;
		case 'select':
			if (toogle_buy_button(ln) === 'buy'){
					var item_in_cart = find_PTO_id_index_incart('l_'+ln);
					if(item_in_cart >= 0){

						windoTOP.cart.items[item_in_cart].qty = parseInt(windoTOP.cart.items[item_in_cart].qty) + parseInt($('#inputcant_'+ln).val());
					}else{
						windoTOP.cart.items.push({'PTO_id':windoTOP.parts.items[ln].PTO_id,'name':windoTOP.parts.items[ln].name,'qty':$('#inputcant_'+ln).val(),'unit_price':windoTOP.parts.items[ln].price,'hasfoto':windoTOP.parts.items[ln].hasfoto});
					}
			}else{
				//windoTOP.parts.src.items[ln].buy = false;
				if(windoTOP.cart.hasOwnProperty('items')){
					var foundItemIndex = windoTOP.cart.search('items','PTO_id',windoTOP.parts.items[ln].PTO_id);
					if (typeof foundItemIndex != 'undefined'){
						remove_from_cart(foundItemIndex,'parts_list')
						windoTOP.cart.items.splice(foundItemIndex,1);
					}
				}
			}
		break;
	}
	cart_buton_showhide(windoTOP.cart.items.length);
}


//mantiene updated la cantidad en el carro y el max cant en 99 para la cantidad de partes del pedido
function old_check_cant(elem,rqtor){
	var e = '#'+elem;
	var subtot = '#cart_sub_tot_'+elem.substring(elem.indexOf('_')+1);
	var ic = find_PTO_id_index_incart(elem);
	$(e).val(($(e).val()>199)?199:$(e).val());
	$(e).val(($(e).val()<1)?1:$(e).val());
	cart.items[ic].qty = $(e).val();
	$(subtot).html((parseFloat(cart.items[ic].unit_price)* $(e).val()).toFixed(2));
}


//controla el toogle on/off del listado detectando
//si el pointer esta sobre el boton de ok para no hacer update remoto de un "toogle off"
function checkIfToogleOnOff(el){
	var nodes = document.querySelectorAll(':hover');
	var i = el.substring(el.indexOf('_')+1);
	return (nodes[nodes.length-1].id.indexOf('buybot_'+i) >= 0 || nodes[nodes.length-1].id.indexOf('icon_'+i) >= 0)? false : true;
}

// SINCRONIZA EL CART LOCAL CON EL SERVIDOR ANTE CAMBIOS DE CANTIDAD
function old_update_cart(elem,rqtor){
	console.log('t:',checkIfToogleOnOff(elem));
	if(checkIfToogleOnOff(elem)){
		var foundItemIndex = find_PTO_id_index_incart(elem);
		//obtengo el item de array cart, actualizo el cant
		// si tiene id de pedido modifica el record
		console.log('found_pto',foundItemIndex);
		windoTOP.cart.items[foundItemIndex].qty = $('#'+elem).val();
		if(cart.items[foundItemIndex].pedido_id > 0){
			$.ajax({
				type : "POST",
				url : "catalogs/update_modif_cart",
				data : {"cart":windoTOP.cart.items[foundItemIndex]},
				dataType:"text",
				success : function(m) {
					console.log('saved_cart modif');
					console.log(m);
				},
				error : function(xhr, ajaxOptions, thrownError) {
					myAlertLoader('failed',thrownError);
				}
			});
		}else{ // es la selecion de un item nuevo
			$.ajax({
				type : "POST",
				url : "catalogs/update_newselection_cart",
				data : {"cart":windoTOP.cart.items[foundItemIndex]},
				dataType:"text",
				success : function(m) {
					// m es el numero de pedido_id
					windoTOP.cart.items[foundItemIndex].pedido_id = m;
					console.log('saved_cart new selection');
					console.log(m);
					//console.log(cart.items[foundItemIndex]);
				},
				error : function(xhr, ajaxOptions, thrownError) {
					myAlertLoader('failed',thrownError);
				}
			});
		}
	if(windoTOP.cart.rqtor.user_acces < constants.user_acces_see_prices){cart_total()}
	}
}


// CAMBIA El ESTADO DEL BOTON DE SELECCION DE PARTES
function toogle_buy_button(ln){
	var line = '#l_'+ln;
	var icon = '#icon_'+ln;
	var cant = '#cant_'+ln;
	if($(icon).attr('class').indexOf('cart') > 0){
		$(line).css({'background-color' : '#2B952C'});
		$(icon).removeClass('glyphicon glyphicon-shopping-cart').addClass('glyphicon glyphicon-ok');
		$(cant).show('slow',function(){var c='#input'+this.id;$(c).focus()});
		return 'buy';
	}else{ // glyphicon OK
		$(line).css({'background-color' : '#363636','color' : '#fff'});
		$(icon).removeClass('glyphicon glyphicon-ok').addClass('glyphicon glyphicon-shopping-cart');
		$(cant).hide('slow');
		return 'cart';
	}
}


// muestra el cart button en la barra superior si hay items
function cart_buton_showhide(itemsInCart){
	if(itemsInCart > 0){
			$('#container_de_partcode').addClass('col-md-2').removeClass('col-md-3');
			$('#cart').html("<span class=\'glyphicon glyphicon-shopping-cart\' aria-hidden=\'true\'></span>&nbsp;("+ itemsInCart+")");

			$('#cart').show();
		}else{
			$('#container_de_partcode').addClass('col-md-3').removeClass('col-md-2');
			$('#cart').html("<span class=\'glyphicon glyphicon-shopping-cart\' aria-hidden=\'true\'></span> (0)");
			$('#cart').hide();
		};
}

// vuelvo al listado de partes
function back_from_cart(){
	if(typeof parts_for_bak !== 'undefined'){
		if(parts_for_bak.last_selected.part_num != ''){
			$('#pn').val(parts_for_bak.last_selected.part_num);
		}else{
			$('#potencia').val(parts_for_bak.last_selected.potencia);
		    $('#products').val(parts_for_bak.last_selected.products);
		    $('#sector').val(parts_for_bak.last_selected.sector);
		}
		list_with_exploded_image(windoTOP.parts_for_bak);
	}
	clean('cart_list');
}

/*

PTO_id: "5A-13621-A2"
hasfoto: false
name: " GASKET VALVE SEAT"
pedido_id: "1333"
qty: "1"
unit_price: "0.27"

iu coder mk_panel -> panel con una tabla dadentro
// panel params: id,panel title,panel content,parent element

*/
/**********************************
* CART TABLE,HEADINGS AND CONTENTS
* lista el contenido del cart
***********************************/

function cart_show(){
	windoTOP.parts.src = windoTOP.cart ;
	var showPrices = (windoTOP.cart.rqtor.user_acces < constants.user_acces_see_prices)? true : false;
   	clean('part_list');
   	clean('cart_list');

  var panelHeading = "Shopping Cart content for user : "+cart.rqtor.nombreusuario;
  var tblHeading = (showPrices)?['Part Code','Description','Img','Price','Qtty','Sub Total'] :['Part Code','Description','Img','Quote Qtty'];
	var res = [];
  cart.items.map(function(itm,index){
   		// content [{'attrib':[],'items':[{'content':'','attrib':[]}]}]
		if(showPrices){
			var c = {'attrib':[
							{'id':'cartline_'+index},
							{'onMouseOver':'hl_in(\'cartline_'+index+'\')'},
							{'onMouseOut':'hl_out(\'cartline_'+index+'\')'}
						],
					'items':[
						{'content':itm['PTO_id'],'attrib':[{'id':'PTO_'+index,}]},
						{'content':itm['name']},
						{'content':showFotoButton(itm,index)},
						{'content':itm['unit_price']},
						{'content':showItemQty(index)},
						{'content':(parseFloat(itm['unit_price'])* parseInt(itm['qty'])).toFixed(2)},
						{'content':showTrashBot(index)}
					]
				}
		}else{
			var c = {'attrib':[
							{'id':'cartline_'+index},
							{'onMouseOver':'hl_in(\'cartline_'+index+'\')'},
							{'onMouseOut':'hl_out(\'cartline_'+index+'\')'}
						],
					'items':[
						{'content':itm['PTO_id'],'attrib':[{'id':'PTO_'+index,}]},
						{'content':itm['name']},
						{'content':showFotoButton(itm,index)},
						{'content':showItemQty(index)},
						{'content':showTrashBot(index)}
					]
				}
		}
   	res.push(c)
	});
	mk_panelWithHeading('cart_panel_content',[{'style':'max-height:600px;overflow:auto;'},{'class':'col-md-6'}],panelHeading,'','cart_panel');
  mk_table('tbl_1',tblHeading,res,'cart_panel_content');
	var footer_content = "<div class= \'row'\><div class=\'col-md-2\'><button type=\'button\' id=\'back_from_cart\' onClick=\'back_from_cart()\' class=\'btn btn-primary\'><span id=\'icon_back\' class=\'glyphicon glyphicon-arrow-left\' aria-hidden=\'true\'> Go Back</span></button></div><div class=\'col-md-2\'><button type=\'button\' id=\'order_send\'class=\'btn btn-primary\' role=\'button\' data-toggle=\'popover\' data-placement=\'auto left\'><span id=\'icon_send\' class=\'glyphicon glyphicon-send\' aria-hidden=\'true\'> Send Order</span></button></div><div class =\'col-md-1\'></div><div class=\'col-md-5\'><span class=\'h3\' id=\'cart_total\'></span></div></div>";
	mk_well('footer','sm',footer_content,'cart_panel');
  $('[data-toggle="popover"]').popover({html:true,content:confirmation_window()});
	if(windoTOP.cart.rqtor.user_acces < constants.user_acces_see_prices){cart_total()}

}

/*
items: Array[3]
0: Object
1: Object
2: Object
=====================
PTO_id: "3A-82370-00"
hasfoto: false
name: "PLUG CAP ASSY"
pedido_id:
qty: "1"
unit_price: "2.25"

*/


function showItemQty(index){
	return "<input id=\'inputcant_"+index+"\' class='form-control' style='padding:5px;width:55px;display:inline;' type='number' min='1' max='199' step='1' value="+cart.items[index].qty+" onBlur=update_cart(this.id,cart) onChange=check_cant(this.id,cart) onKeyPress=check_enter(this.id)>"
}

function showTrashBot(index){
	return "<button id=\'trash_"+index+"\' onClick=remove_from_cart(this.id,\'cart_list\') type='button' class='btn btn-sm btn-default'><span id=\'icon_"+index+"\' class='glyphicon glyphicon-trash' aria-hidden='true'></span></button>";
}

// si hay foto para mostrar devuelve el html del button para agregar en listados
function showFotoButton(item,index){
	var res = (item.hasfoto === true)?"<button onClick=\"show_foto(\'"+item.PTO_id+"\',\'"+item.name.split(' ').join('_') +" ')\" type='button' class='btn btn-sm btn-default'><span class='glyphicon glyphicon-camera' aria-hidden='true'></span></button>":"";
	return res;
}
// boton de seleccion de producto
function showBuyButton(index){
	var res = "<button id=\'buybot_"+index+"\' onClick=ad_to_cart(\'"+index+"\',\'select\') type='button' class='btn btn-sm btn-default'><span id=\'icon_"+index+"\' class='glyphicon glyphicon-shopping-cart' aria-hidden='true'></span></button><span id=\'cant_"+index+"\' style='display:none;margin:2px;'><input id=\'inputcant_"+index+"\' class='form-control' style='padding:5px;width:55px;display:inline;' type='number' min='1' max='199' step='1' value=1 onBlur=update_cart(this.id,parts)  onChange=check_cant(this.id,parts) onKeyPress=check_enter(this.id) ></span>";
	return res;
}


//muestra el total del carro de compras activo
function cart_total(){
	var tot_cart = cart.items.reduce(function(s,tot){return s + (parseFloat(tot.unit_price) * parseInt(tot.qty))},0);
	//console.log(tot_cart);

	$('#cart_total').html("<strong>Order Total Amount u$s: "+tot_cart.toFixed(2)+"<strong>");
}


function remove_from_cart (elem,rqtor) {
	switch(rqtor){
		case 'cart_list':
			var index = elem.substring(elem.indexOf('_')+1);
			$('#cartline_'+index).css({'background-color':'#E84047'}).hide('slow',function(){
				$('#cartline_'+index).remove();
				cart.items.splice(index,1);
				if(windoTOP.cart.rqtor.user_acces < constants.user_acces_see_prices){cart_total()}
				cart_buton_showhide(windoTOP.cart.items.length);
				if (cart.items.length == 0){clean('cart_list')};
			});
			break;
		case 'parts_list':
				var index = elem;
			break;
	};
	// REMUEVO EL ITEM BORRADO DEL LISTADO REMOTO
	if(cart.items[index].hasOwnProperty('PTO_id')){
		console.log('to remove',cart.items[index]);
		$.ajax({
				type : "POST",
				url : "catalogs/delete_cart_item",
				data :  {'pedido_id' : cart.items[cart.search('items','PTO_id',cart.items[index].PTO_id)].pedido_id},
				dataType:"text",
				success : function(res) {
						console.log('removed:', res);
				},
				error : function(xhr, ajaxOptions, thrownError) {
					alert(thrownError);
				}
			});
		cart_buton_showhide(windoTOP.cart.items.length);
	}
}



function cart_checkout(){
	//console.log(cart.rqtor.idusuario);
	myAlertLoader('show');
	$.ajax({
				type : "POST",
				url : "catalogs/checkout",
				data :  {'userid' : cart.rqtor.idusuario},
				dataType:"text",
				success : function(res) {
						// res trae el new_order_number
						console.log('res:', res);
						windoTOP.cart.items.map(function(obj,idx){$('#trash_'+idx).hide();$("#inputcant_"+idx).prop('disabled', true);});
						windoTOP.cart.items = []
						cart_buton_showhide(windoTOP.cart.items.length);
						clean('selectors');
						$('#footer').html("<div class='well well-sm'><div class='row'><div class='col-md-3'><span class='h4'> Order sent successfully...</span></div><div class='col-md-2'><button onClick=javascript:cart_print() type='button' class='btn btn btn-primary navbar-btn'><span id=\'icon_print\' class='glyphicon glyphicon-print' aria-hidden='true'> Print</span></button></div></div></div>");
						myAlertLoader('hide');
				},
				error : function(xhr, ajaxOptions, thrownError) {
					//alert(thrownError);
					myAlertLoader('failed',thrownError);
				}
			});
}

function confirmation_window(){
	return "<p>Are you Sure?</p><button id=\'ye\' onClick=confirm(this.id,\'Si\') type=\'button\' class=\'btn btn-default btn-xs\'><span class='glyphicon glyphicon-ok' aria-hidden='true'> Yes</span></button>&nbsp;<button id=\'no\' onClick=confirm(this.id,\'No\') type='button' class='btn btn-default btn-xs'><span class=\'glyphicon glyphicon-remove\' aria-hidden=\'true\'> No</span></button>";
}
function confirm(id,p){

	$('#order_send').popover('hide');
	if(p === 'Si'){
		javascript:cart_checkout();
	}
}



/**************************
*MOUSE OVERS EL LISTADO DE PARTES
***************************/

// handler de mouse over y last clicked
function link_in(item){
	if(item.id != windoTOP.curr_selected){
		$(item).css({
			'background-color' : '#363636',
			'color' : '#fff',
			'cursor': 'pointer'
		});
	}

}

function link_out(item){

	if(item.id != windoTOP.curr_selected){
		console.log('out true'+item.id +'cs:'+ windoTOP.curr_selected);
		$(item).css({
			'background-color' : '#D4D4D4',
			'color' : '#000',
			'cursor': 'default'
		});
	}
}

function mark_linked(item){
	var s = '#'+windoTOP.curr_selected;
	$(s).css({
		'background-color' : '#D4D4D4',
		'color' : '#000',
	});
	$(item).css({
		'background-color' : '#294666',
		'color' : '#fff',
	});
	windoTOP.curr_selected = item.id;
	console.log(windoTOP.curr_selected);
}



/**************************
* interaccion con  ORDERS class
 ***************************/


function set_owner(id,name){
	$('#owner-label').val(name);
	$('#owner-id').val(id);
}

function set_state(id){
	var states= ['null','New','In Process','Completed'];
	$('#state-label').val(states[id]);
	$('#state-id').val(id);
}

function get_orders(){
	var owner= $('#owner-id').val();
	var state= $('#state-id').val();
	myAlertLoader('show');
		$.ajax({
			type : "POST",
			url : "orders/get_list",
			data : {'owner':owner,'state':state},
			dataType : "json",
			success : function(d) {
				var filtered = d.groups.map(function(grpindex){return {"order_number":grpindex.order_number,"items":d.all.filter(function(allindex){return allindex.order_number === grpindex.order_number})}});

				windoTOP.r_orders = filtered;

				list_orders(filtered);
				myAlertLoader('hide');
			},
			error : function(xhr, ajaxOptions, thrownError) {
				myAlertLoader('failed',thrownError);
			}
		});
}


function list_orders(list){
	clean('orders_list');
	// ******  LISTA  DE pedidos agrupada por order number
    $('#container').append("<div class='panel-group' id='accordion' role='tablist' aria-multiselectable='true'>");
    $('#accordion').append(list.map(function(order){return make_order_collapse(order)}));
    collapse_all(list)

}


/***********************************************
* CONTENIDO DEL LISTADO DE ORDENES
************************************************/

function make_order_collapse(order){
	var table_content_end = "</tbody></table></div></div></div>";
	return get_orders_panel(order.order_number)+get_orders_table()+get_orders_content(order)+table_content_end;
}

function get_orders_panel(ordnum){return "<div class='panel panel-default'><div class='panel-heading' role='tab' id='heading_"+ordnum+"'><span class='navbar-brand'><a role='button' data-toggle='collapse' data-parent='#accordion' href='#collapse_"+ordnum+"' aria-expanded='false' aria-controls='collapse_"+ordnum+"'>Order # "+ordnum+"</a></span>"+make_proc_buttons(ordnum)+"</div></div><div id='collapse_"+ordnum+"' class='panel-collapse collapse in' role='tabpanel' aria-labelledby='heading_"+ordnum+"'><div class='panel-body'>";
}

function get_orders_table(){
	var table_heading = "<th>Select</th><th>Qtty</th><th>name</th><th>Part Id</th><th>Price</th><th>Subtotal</th><th>Date</th><th>PI #</th><th>PO #</th><th>CI #</th>";
	return "<table class='table table-hover'><thead><tr>"+table_heading+"</tr></thead><tbody>";
}

function get_orders_content(order){
	return order.items.map(function(item){return "<tr><td><input type='checkbox' id='chkbox_'"+item.pedido_id+" ></td><td>"+item.qty+"</td><td>"+item.name+"</td><td>"+item.PTO_id+"</td><td>"+item.dealer_price+"</td><td>"+item.subtotal+"</td><td>"+item.date+"</td><td>"+item.PI_number+"</td><td>"+item.PO_number+"</td><td>"+item.CI_number+"</td><td><button onClick=edit_item("+item.pedido_id+") type='button' class='btn btn-sm btn-default'><span class='glyphicon glyphicon-edit' aria-hidden='true'></span></button></td></tr>"}).join('');
}

function collapse_all(list){
	var s = list.map(function(order){$('#collapse_'+order.order_number).collapse('hide')})
}

function make_proc_buttons(ordnum){
	return "<div class='collapse navbar-collapse'><ul class='nav navbar-nav'><li class='dropdown'><button class='btn btn-default dropdown-toggle'style='margin-top:8px;' type='button' id='drop_process' data-toggle='dropdown' aria-haspopup='true' aria-expanded='true'>Process<span class='caret'></span></button><ul class='dropdown-menu' aria-labelledby='drop_process'><li><a href='javascript:make_pi("+ordnum+")'>Make Proforma Invoice</a></li><li><a href='javascript:make_po("+ordnum+")'>Make Production Order</a></li><li><a href='javascript:make_ci("+ordnum+")'>Make Comercial Invoice</a></li></ul></li></ul></div>";
}

function make_pi(ordnum){

	make_printable('pi',ordnum);


	//console.log("en mk_PI:",ordnum_items.items);
}


function make_printable(obj,data){
switch(obj){
	case "pi":
		var what_to_print = ['order_number','dealer_price','name'];
		var ordnum_items = r_orders.filter(function(itm){return itm.order_number == data})[0].items;
		var itms_list=ordnum_items.map(function(oitm){ return what_to_print.map(function(tp){if(tp in oitm){var o ={};o[tp]=oitm[tp];return o}})});

			console.log(itms_list);
	break;

}
}
/*
var items_toprint = order_items.map(function(i){
		return what_to_print.map(function(tp){
		return pi_template.replace("#{"+tp+"}#", i.tp);
		})
	})


CI_number: null
PI_number: null
PO_number: null
PTO_id: "04561-16068"
back_order_number: null
client_id: "406"
date: null
dealer_price: "0.09"
name: "CIRCLIP"
order_number: "1024"
pedido_id: "1229"
qty: "1"
state: "1"
subtotal: "0.09"
unit_price: "0.06"

*/





   	// ***********GUARDO LA SELECCION PARA HACER BOTON DE BACK
   	//windoTOP.parts_for_bak = src ;
  	//windoTOP.parts_for_bak.last_selected ={'part_num':$('#pn').val(),'products':$('#products').val(),'potencia':$('#potencia').val(),'sector':$('#sector').val()};
    // *****************************************************
    //clean('cart_list');
    //parts.items = [];
	/****************************
	* WRITES HTML TO SCREEN
	*****************************/
	/*
	$('#acordion').append()



	// TABLE & HEADINGS
    $('#listado').append("<div id='tbl_container' class='col-md-6' style='max-height:600px;overflow:auto;'><table id='list_table' class='table'><thead><tr><th>Part #</th><th>Part Code</th><th>Description</th><th>Img</th>"+((src.requestor.user_acces < constants.user_acces_see_prices)?"<th>Price</th><th>Buy</th>":"<th>Quote</th>")+"</tr></thead><tbody>");
    // *********
    //ROWS OF THE LIST
	lines(src,'orders_item',0);
	$('#footer').append("<div class=\'well well-sm\'><div class='row'><div class=\'col-md-2\'><button type=\'button\' id=\'back_from_orders_list\' onClick=\'back_from_orders_list()\' class=\'btn btn-primary\'><span id=\'icon_back\' class=\'glyphicon glyphicon-arrow-left\' aria-hidden=\'true\'> Go Back</span></button></div></div></div>");

	function orders_item(line,index){
		var p = new orderlist_item()
		p.set(line.items[index]);
		//parts.items.push(p);
		$('#list_table').append("<tr id=\'l_"+index+"\' onMouseOver=highlight(\'"+index+"\',\'number_"+line.items[index].refnum+"\') onMouseOut=highlight_rem(\'"+index+"\')><td>"+line.items[index].refnum+"</td><td id=\'PTO_"+index+"\'>"+p.PTO_id+"</td><td>"+p.name+ "</td>"+((line.items[index].hasfoto === true)?"<td><button onClick=show_foto("+index+") type='button' class='btn btn-sm btn-default'><span class='glyphicon glyphicon-camera' aria-hidden='true'></span></button></td>":"<td></td>")+" "+((line.requestor.user_acces < constants.user_acces_see_prices)?"<td>"+p.price+"</td>" :"")+"<td><a href='#'><button id=\'buybot_"+index+"\' onClick=ad_to_cart(\'"+index+"\',\'select\') type='button' class='btn btn-sm btn-default'><span id=\'icon_"+index+"\' class='glyphicon glyphicon-shopping-cart' aria-hidden='true'></span></button><span id=\'cant_"+index+"\' style='display:none;margin:7px;'><input id=\'inputcant_"+index+"\' type='number' min='1' max='99' step='1' value=1 onBlur=update_cart(this.id,parts)  onChange=check_cant(this.id,parts) onKeyPress=check_enter(this.id) ></span></a></td></tr>");
	}



	*/
