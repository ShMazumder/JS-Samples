
	var ESM = {
		isModalCreated:false,
		data:[],
		groupBy:undefined,
		filterBy:{},
		currentTrigger:undefined,
		triggers:{},
		triggersCallback:{},
		ESMids:{
			modalid:'employee_show_modal_root_div',
			modalformid:'employee_show_modal_form',
			datarootid:'employee_show_modal_data_root_div',
		},
		classArr: ["alert-primary", "alert-info", "alert-success", "alert-warning"],
		setup:function(options){
			ESM.groupBy = options.groupBy!=undefined ? options.groupBy : undefined;
			// ESM.filters = options.filters!=undefined ? options.filters : undefined;
			ESM.data = options.data;

			ESM.init();
		},
		init:function(){
			// create a modal having modalid
			//
			var modalDiv = $("<div>").attr({
				"id": ESM.ESMids.modalid,
				"class": "modal fade employee_modal",
				"tabindex": "-1",
				"role": "dialog"
			}).appendTo($("#modal_content_div"));

			var modalDialogDiv = $("<div>").attr({
				"class": "modal-dialog employee_modal_dialog",
				"role": "document",
				"style": "min-width:75% !important;"
			}).appendTo(modalDiv);

			var modalForm = $("<form>").attr({
				"id": ESM.ESMids.modalformid
			}).appendTo(modalDialogDiv);

			var modalContentDiv = $("<div>").attr("class", "modal-content").appendTo(modalForm);

			var modalHeaderDiv = $("<div>").attr("class", "modal-header").appendTo(modalContentDiv);

			var h5Tag = $("<h5>").append("Employee Selection Modal").attr("class", "modal-title").appendTo(modalHeaderDiv);
			var modalCloseButton = $("<button>").append('<span style="color:black" aria-hidden="true">&times;</span>')
				.attr({
					"type": "button",
					"class": "close",
					"data-dismiss": "modal",
					"aria-label": "Close"
				}).appendTo(modalHeaderDiv);

			var modalBodyDiv = $("<div>").attr("class", "modal-body").appendTo(modalContentDiv);
			var modalFooterDiv = $("<div>").attr("class", "modal-footer").appendTo(modalContentDiv);
			var modalFooterContentRoot = $("<div>").attr("style", "display:flex; justify-content:flex-end;").appendTo(modalFooterDiv);

			var modalFooterSaveButton = $("<button>").append('Select').attr('class', 'btn btn-primary').appendTo(modalFooterContentRoot);

			(function ($) {
				modalFooterSaveButton.on('click', function(){
					var data = "";
					ESM.triggersCallback[ESM.currentTrigger].postCallback(data);
					$("#" + ESM.ESMids.modalid).modal("hide");
				});

				modalFooterSaveButton.on("click", function (e) {
					e.preventDefault();

					var checkedInputList = $("#all_employee_selection_div_container input[type=checkbox]:checked").toArray();
					var data = [];

					$.each(checkedInputList, function (key, checkedInput) {
						data[data.length] = $(checkedInput).data("data");
					});

					ESM.triggersCallback[ESM.currentTrigger].postCallback(data);
					$("#" + ESM.ESMids.modalid).modal("hide");
				})

			})(jQuery);

			var inputGroupDiv = $("<div>").attr("class", "input-group mb-4").appendTo(modalBodyDiv);
			var searchPanelDiv = $("<div>").attr("class", "input-group-btn search-panel").appendTo(inputGroupDiv);
			var searchConceptButton = $("<button>").append('<span id="search_concept">Filter by</span> <span class="caret"></span>')
				.attr({
					"type": "button",
					"class": "btn btn-default dropdown-toggle",
					"data-toggle": "dropdown"
				}).appendTo(searchPanelDiv);

			var dropdownMenuList = $("<ul>").attr({
					"class": "dropdown-menu",
					"role": "menu"
				}).appendTo(searchPanelDiv);

			dropdownMenuList.append(
				'<li><a href="#employeeno" class="pl-2">Id</a></li>',
				'<li><a href="#employeetitle" class="pl-2">Name</a></li>',
				'<li><a href="#section" class="pl-2">Section</a></li>',
				'<li class="divider" class="pl-2"></li>',
				'<li><a href="#all" class="pl-2">Anything</a></li>'
			);

			var hiddenInput = $("<input>").attr({
				 "type": "hidden",
				 "id": "employee_search_param_input",
				 "name": "employee_search_param_input",
				 "value": "all"
			}).appendTo(inputGroupDiv);

			var textInput = $("<input>").attr({
				 "type": "text",
				 "id": "employee_search_term_input",
				 "name": "employee_search_term_input",
				 "class": "form-control",
				 "placeholder": "Search term..."
			}).appendTo(inputGroupDiv);

			var searchPanelDiv = $("<div>").attr({
				"id": ESM.ESMids.datarootid,
				"class": "text-dark mx-3"
			}).appendTo(modalBodyDiv);

			(function ($) {
				textInput.keyup(function (e) {
					var searchTerm = textInput.val().trim();
					var searchParam = hiddenInput.val().trim();

					if (e.altKey || e.ctrlKey || e.shiftKey) {
						return;
					}
					var found_employees = [];
					switch (searchParam) {
						case 'employeeno':
							found_employees = $.grep(ESM.data, function(v) {
								return v.employeeno.toString().search(new RegExp(searchTerm, 'i')) >= 0;
							});
							break;
						case 'employeetitle':
							found_employees = $.grep(ESM.data, function(v) {
								return v.employeetitle.toString().search(new RegExp(searchTerm, 'i')) >= 0;
							});
							break;
						case 'section':
							found_employees = $.grep(ESM.data, function(v) {
								return v.section.toString().search(new RegExp(searchTerm, 'i')) >= 0;
							});
							break;
						default:
							found_employees = $.grep(ESM.data, function(v) {
								return (v.employeeid.toString().search(new RegExp(searchTerm, 'i')) >= 0)
									|| (v.employeename.toString().search(new RegExp(searchTerm, 'i')) >= 0);
							});
					};

					ESM.loadData(found_employees);
				});
			})(jQuery);

			ESM.isModalCreated = true;
			ESM.loadData(ESM.data);
		},
		groupByFunc: key => array =>
		  array.reduce((objectsByKeyValue, obj) => {
			var value = obj[key];
			objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
			return objectsByKeyValue;
		}, {}),
		loadData:function(result){
			// populate data on modal

			var groupedList = ESM.groupByFunc(ESM.groupBy);
			$("#" + ESM.ESMids.datarootid).empty();
			var i = 0;

			$.each(groupedList(result), function(key, value) {
				var rowdiv1 = $("<div>")
					.attr("class", " row1 mt-1")
					.appendTo($("#" + ESM.ESMids.datarootid));

				var rowdiv2 = $("<div>")
					.attr("class", "select-all")
					.attr('style', "display:flex; flex-direction:row; justify-content: flex-start;")
					.appendTo(rowdiv1);

				var alldivcheckbox = $("<div>")
					.attr("class", " "  + " rounded-left")
					.attr('style', 'width:max-content; height:70px; display:flex; flex-direction:column; justify-content:center;')
					.appendTo(rowdiv2);

				var allemployeecheckbox = $("<input>")
					.attr({
						"id": "employee_checkbox_all",
						"class": "",
						"style": "",
						"type":"checkbox"
					}).appendTo(alldivcheckbox);

				var rowdiv3 = $("<div>")
					.append("Select All")
					.attr("class", "font-weight-bold")
					.appendTo(rowdiv2);

				rowdiv2.data('selection', false);

				var rowdivcontainer = $("<div>")
					.attr({
						"id": "all_employee_selection_div_container",
						"class": " row mt-1"
					}).appendTo(rowdiv1);

				(function ($) {
					//select all checkboxes
					allemployeecheckbox.change(function () {  //"select all" change
						rowdivcontainer.find("input[type=checkbox]")
							.prop('checked', $(this).prop("checked")); //change all "input[type=checkbox]" checked status
					});

					rowdiv2.on('click', function(){

						allemployeecheckbox.prop('checked', !allemployeecheckbox.prop('checked'));
						rowdivcontainer.find("input[type=checkbox]")
							.prop('checked', allemployeecheckbox.prop("checked")); //change all "input[type=checkbox]" checked status
						//allemployeecheckbox.trigger('click');
						// allemployeecheckbox.trigger('change');

					});
				})(jQuery);

				$.each(value, function(k, v) {
					var rowdiv4 = $("<div>")
					.attr({
						"class": "col-12 col-md-6 col-lg-6 mt-1 rounded-left "+ ESM.classArr[i],
						"style": "margin:0px 0px 0px 0px; border: 5px solid red; border-right:none; border-top:none; border-bottom:none; cursor:pointer; display:flex; justify-content:flex-start; padding:5px 10px;"
					}).appendTo(rowdivcontainer);

					var rowdivcheckbox = $("<div>")
					.attr("class", " " )
					.attr('style', 'width:max-content; height:70px; display:flex; flex-direction:column; justify-content:center;')
					.appendTo(rowdiv4);

					var employeecheckbox = $("<input>")
					.attr({
						"type":"checkbox",
						"class": "",
						"style": ""
					}).appendTo(rowdivcheckbox).data("data",v);

					var rowdiv5 = $("<div>")
					.attr("class", "ESM_checkbox_employee" )
					.attr('style', 'width:max-content; height:70px; display:flex; flex-direction:column; justify-content:center;')
					.appendTo(rowdiv4);

					var employeeImg = $("<img>")
					.attr({
						"src": "assets/logo/ogsb.jpeg",
						"alt": "person_avatar",
						"class": "img-thumbnail rounded-circle",
						"style": "width:60px; height:60px; margin:0px 0px 0px 20px;"
					}).appendTo(rowdiv5);

					var rowdiv6 = $("<div>")
					.attr("class", " " )
					.attr("style", "padding:0px 0px 0px 20px; height:70px; display:flex; flex-direction:column; justify-content:center;")
					.appendTo(rowdiv4);

					rowdiv6.html('<h6 class="pt-2">Name: ' + v.employeename + ' </h6><h6>ID: ' + v.employeeid + '</h6>');

					// rowdiv4.data("data", v);

					(function ($) {

						//"checkbox" change
						employeecheckbox.change(function () {
							//uncheck "select all", if one of the listed checkbox item is unchecked
							if ($(this).prop("checked") === false) $("#employee_checkbox_all").prop('checked', false); //if this item is unchecked change "select all" checked status to false

							//check "select all" if all checkbox items are checked
							if ($("#all_employee_selection_div_container input[type=checkbox]:checked").length === $("#all_employee_selection_div_container input[type=checkbox]").length) {
								$("#employee_checkbox_all").prop("checked", true);
							}
						});

						rowdiv4.on('click', function(){
							employeecheckbox.prop('checked', !employeecheckbox.prop('checked'));

							//uncheck "select all", if one of the listed checkbox item is unchecked
							if (employeecheckbox.prop("checked") === false) $("#employee_checkbox_all").prop('checked', false); //if this item is unchecked change "select all" checked status to false
							//check "select all" if all checkbox items are checked
							if ($("#all_employee_selection_div_container input[type=checkbox]:checked").length === $("#all_employee_selection_div_container input[type=checkbox]").length) {
								$("#employee_checkbox_all").prop("checked", true);
							}
						});
					})(jQuery);
				});
				i++;
				i = i > 3 ? 0 : i;
			});
		},
		addTrigger:function(id, callback){
			ESM.triggers[ESM.triggers.length] = id;
			ESM.triggersCallback[id] = {};
			ESM.triggersCallback[id].postCallback = callback;
			ESM.triggersCallback[id].preCallback = function(){

			};

			ESM.triggerListener();
		},
		addTriggerWithPreCallback:function(id, preCallback, callback){
			ESM.triggers[ESM.triggers.length] = id;
			ESM.triggersCallback[id] = {};
			ESM.triggersCallback[id].postCallback = callback;
			ESM.triggersCallback[id].preCallback = preCallback;

			ESM.triggerListener();
		},
		triggerListener:function(){
			$.each(ESM.triggers, function(key, value){
				$('#'+value).on('click', function(){
					ESM.currentTrigger = value;

					ESM.triggersCallback[ESM.currentTrigger].preCallback();

					if(!ESM.isModalCreated){
						ESM.init();
					}
					ESM.showModal();

				});
			});
		},
		showModal:function(){
			$('#'+ESM.ESMids.modalid).modal('show');
		}
	}

