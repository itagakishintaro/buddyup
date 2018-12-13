const fs = require('fs');


var argv = argCheck();
firebasercReplace(argv.communityName);



function argCheck(){
	if(process.argv.length < 3) {
		console.log("arg_err: community name is needed")
	} else {
		return {
			communityName : process.argv[2]
		}
	}
}

function firebasercReplace(communityName){
	fs.readFile('../.firebaserc', 'UTF-8', 
		(error,data)=>{
			var content = data.
				replace(/buddyup-204005/g, 'buddyup' + communityName);
			console.log(content);
			fs.writeFileSync("../.firebaserc", content);
		}
	);	
}

