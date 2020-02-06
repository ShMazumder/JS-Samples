# JS-Samples

# multi-item-select-modal-1.0.js
Sample use:

i. Adding a Trigger:

<code>
ESM.addTriggerWithPreCallback('button_id', function(){

	console.log("Pre-Callback");
	
}, function(selectedDataAsArray){
	// modal show
	
	console.log("Post-Callback");
});
</code>
