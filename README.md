#2 atsiskaitymas

## commands to start the app:

docker-compose build && docker-compose up

##api running on localhost:3000 (or shops)

// get , put , delete , post, patch
to //cars:id

to //carOwner:id
gets car owner

//carOwners
//gets all owners

/api/carOwner
carId userId
buys car for that user

Post new user through my service
/api/users

// fields
// name : string
// bought: bool
// price: int
//userId: int

<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
  <Body>
	<CarsRequest xmlns="http://www.examples.com/wsdl/myAwesesomeService.wsdl">
	</CarsRequest>
  </Body>
</Envelope>

<Envelope xmlns="http://schemas.xmlsoap.org/soap/envelope/">
  <Body>
	<carChangeOwnerRequest xmlns="http://www.examples.com/wsdl/myAwesesomeService.wsdl">
		<itemId>1</itemId>
		<userId>3</userId>
	</carChangeOwnerRequest>
  </Body>
</Envelope>
