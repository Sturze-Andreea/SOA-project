workspace "Animal Adoption System" "Manages animal listings, adoptions, and notifications." {

    !identifiers hierarchical

    model {

        user = person "User" "Wants to adopt animals."

        # Our main system boundary
        system = softwareSystem "Animal Adoption System" "Handles the entire adoption process." {
			adoptionService = container "Adoption Service" "Node.js" "Handles adoption requests on port 5000."{
				appjs = component "app.js" "Express.js" "Exposes the endpoints from different routes."
				adoptionjs = component "adoption.js" "Express.js" "Handles the adoption routes." 
					postApi = component "post API" "JavaScript" "Handles the create adoption request route."
					publishEvent = component "publishEvent()" "JavaScript" "Publishes RabbitMQ event."
					sendMessage = component "sendMessage()" "JavaScript" "Sends message through Kafka."
				
				kafkajs  = component "kafka.js" "Express.js" "Sends messages to Kafka."
				AdoptionRequest  = component "AdoptionRequest" "Mongoose Model" "Represents the adoption schema in MongoDB." 
			
			}
			analyticsService = container "Analytics Service" "Node.js" "Consumes Kafka events, WebSocket on port 5003."
			notificationsService = container "Notifications Service" "Node.js" "Sends emails via the AWS API."
			mainMFE = container "Main MFE" "React" "The main entry point for the user’s browser."
			adoptionMFE = container "Adoption MFE" "React" "UI for browsing animals, submitting adoption requests."
			analyticsMFE = container "Analtics MFE" "React" "UI for real-time analytics or dashboards.."
			notificationsMFE = container "Notifications MFE" "React" "UI that shows live notifications or statuses."
		}

        rabbitmqSS = softwareSystem "RabbitMQ" "Message broker (async notifications)."
        kafkaSS = softwareSystem "Kafka" "Event streaming platform."
        mongodbSS = softwareSystem "MongoDB" "Stores data (adoptions, analytics)."

        user -> system "Uses"

        

        user -> system.mainMFE "Submits adoption requests"
        
        system.mainMFE -> system.adoptionMFE ""
        system.mainMFE -> system.analyticsMFE ""
        system.mainMFE -> system.notificationsMFE ""
        
        system.adoptionMFE -> system.adoptionService "Submit adoption requests."
        system.analyticsMFE -> system.analyticsService "View real-time analytics."
        system.notificationsMFE -> system.notificationsService "View real-time notifications."

        system.adoptionService -> rabbitmqSS "Publishes queue messages (adoption_created)"
        system.adoptionService -> kafkaSS "Publishes adoption events"
        system.adoptionService -> mongodbSS "Stores adoption requests"

        system.analyticsService -> kafkaSS "Consumes adoption events"
        system.analyticsService -> mongodbSS "Stores analytics"
        system.analyticsService -> rabbitmqSS "Consumes queue messages"

        system.notificationsService -> rabbitmqSS "Consumes messages to send notifications"

        system.adoptionService.appjs -> system.adoptionService.adoptionjs "Invokes business logic"
        system.adoptionService.adoptionjs -> system.adoptionService.kafkajs "Sends events through Kafka"
        system.adoptionService.adoptionjs -> system.adoptionService.AdoptionRequest "Stores adoption data in MongoDB"
        system.adoptionService.AdoptionRequest -> mongodbSS "Stores data in MongoDB"

        system.adoptionService.postApi -> system.adoptionService.publishEvent "Connects to RabbitMQ and sends the event"
		system.adoptionService.postApi -> system.adoptionService.SendMessage "Connects to Kafka and sends the message"

    }

    views {

        systemContext system "SystemContextDiagram" {
            include *
            autolayout lr
            title "Animal Adoption System - Context (Level 1)"
            description "Shows the system boundary plus external actors/systems."
        }

        container system "ContainerDiagram" {
            include *
            autolayout lr
            title "Animal Adoption System - Containers (Level 2)"
            description "Shows internal containers (microservices) + external software systems (RabbitMQ, Kafka, MongoDB)."
        }

        component system.adoptionService "AdoptionServiceComponents" {
            include system.adoptionService.appjs
            include system.adoptionService.adoptionjs
            include system.adoptionService.kafkajs
            include system.adoptionService.AdoptionRequest
            autolayout lr
            title "Adoption Service - Component Diagram (Level 3)"
            description "Detailed breakdown of the internal components in Adoption Service."
        }

        component system.adoptionService "AdoptionServiceCode" {
            include system.adoptionService.postApi
            include system.adoptionService.publishEvent
            include system.adoptionService.sendMessage
            autolayout lr
            title "Adoption.js - Code Diagram (Level 4)"
            description "Shows an example code from adoption.js"
        }

        styles {
            element "Person" {
                background #116611
                shape person
                color white
            }
            element "Software System" {
                background #2D882D
                color white
            }
            element "Container" {
                background #55aa55
                color white
            }
            element "Component" {
                background #85bbf0
            }
        }
    }

}
