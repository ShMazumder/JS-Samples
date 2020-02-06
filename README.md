# JS-Samples

# multi-item-select-modal-1.0.js

## Sample use:

i. Adding Trigger with only Post Callback method:

```JS
ESM.addTrigger('button_id', function(selectedDataAsArray){
	console.log("Post-Callback");
});
```

ii. Adding a Trigger with Pre && Post Callback methods:
```JS
ESM.addTriggerWithPreCallback('button_id', function(){
	console.log("Pre-Callback");
}, function(selectedDataAsArray){
	console.log("Post-Callback");
});
```
