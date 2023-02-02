# Bug

When we specify 2 ingresses to the same host it doesn't work.

```yaml
  rules:
    - host: demo.local
      http:
        paths:
        - path: "/"
          pathType: ImplementationSpecific
          backend:
            service:
              name: demo-v2
              port:
                name: http
```

```yaml
  rules:
    - host: demo.local
      http:
        paths:
        - path: "/echo"
          pathType: ImplementationSpecific
          backend:
            service:
              name: demo-v2
              port:
                name: http
```

Nginx ingress controller logs

```txt
W0106 10:15:42.185834       8 controller.go:1568] unable to find real backend for alternative backend default-demo-v2-80. Deleting.
I0106 10:15:42.187897       8 event.go:285] Event(v1.ObjectReference{Kind:"Ingress", Namespace:"default", Name:"nginx-stable", UID:"401268f1-c403-4a98-9ac5-837f9bf724ea", APIVersion:"networking.k8s.io/v1", ResourceVersion:"1674573632", FieldPath:""}): type: 'Normal' reason: 'Sync' Scheduled for sync
I0106 10:15:42.189186       8 event.go:285] Event(v1.ObjectReference{Kind:"Ingress", Namespace:"default", Name:"nginx-canary", UID:"f3e20cee-3cbf-447d-8512-0236a2cc2703", APIVersion:"networking.k8s.io/v1", ResourceVersion:"1674573633", FieldPath:""}): type: 'Normal' reason: 'Sync' Scheduled for sync
I0106 10:15:42.189911       8 event.go:285] Event(v1.ObjectReference{Kind:"Ingress", Namespace:"default", Name:"nginx-stable-echo", UID:"44a8a785-5fdf-4823-8587-04361d753af6", APIVersion:"networking.k8s.io/v1", ResourceVersion:"1674573634", FieldPath:""}): type: 'Normal' reason: 'Sync' Scheduled for sync
```
