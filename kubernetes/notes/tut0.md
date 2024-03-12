#### config.yml

- It has 3 parts
  1. metadata
  2. specification
  3. status

```bash
# to get info in details or wide
kubectl get pod -o wide



```

##### to get info about the status , the 3rd part of .yml file

kubectl get deployment nginx-deployment -o yaml > nginx-deployment-result.yaml

#### demo project of compose.yml

##### Steps:

Note: Remember the order to create pods should be in-order otherwise give error

1. create deployment config for mongodb

```yml
# mongo.yml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mongodb-deployment
  labels:
    app: mongodb
spec:
  replicas: 1
  selector:
    matchLabels:
      app: mongodb
  template:
    metadata:
      labels:
        app: mongodb
    spec:
      containers:
        - name: mongodb
          image: mongo
          ports:
            - containerPort: 27017
          env:
            - name: MONGO_INITDB_ROOT_USERNAME
              valueFrom:
                secretKeyRef:
                  name: mongodb-secret
                  key: mongo-root-username
            - name: MONGO_INITDB_ROOT_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: mongodb-secret
                  key: mongo-root-password
---
apiVersion: v1
kind: Service
metadata:
  name: mongodb-service
spec:
  selector:
    app: mongodb
  ports:
    - protocol: TCP
      port: 27017
      targetPort: 27017
```

2. create secret for mongodb

```bash
#mongo-secret.yml
apiVersion: v1
kind: Secret
metadata:
    name: mongodb-secret
type: Opaque
data:
    mongo-root-username: dXNlcm5hbWU=
    mongo-root-password: cGFzc3dvcmQ=

```

**Note**:

- since our deployment depends on secret so first create secret in k8s otherwise give error.

3. create service in the same mongo.yml

**Note**:

    i. service bind or reference pod by **selector:labels**

4. Now run

```bash
kubectl apply -f mongo.yml
```

- now you will notice service is created and deployment is unchanged detected.
