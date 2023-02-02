# Multiple ingress paths with a new path in canary ingress

## Use case

Let's say we have an application with multiple ingress paths. A new version (canary) of application adds a new path `/echo` which doesn't exist in the old one `stable`.
Now if you add a path to the `ingress-canary.yaml`, it will be missing in the `ingress-stable.yaml`. When you apply this configuration you will see the similar error in nginx logs:

```bash
$ kubectl logs -f -lapp.kubernetes.io/name=ingress-nginx -n nginx-ingress

W0106 09:58:51.722004       7 controller.go:1568] unable to find real backend for alternative backend default-echo-v2-80. Deleting
```

The canary configuration won't apply, and when you call your service it will always hit to v1.

```bash
$ curl -H "Host: demo.local" localhost:8080 --cookie "canary-cookie=always
"v1, pod-> demo-v2-885587579-j4674"
```

When you add a new ingress paths in the new version of your application, you can define in the default ingress (`ingress-stable.yaml`) with the new backend (`demo-v2`), the old version of application in most cases won't have any urls to it. It will be only used in a new version (canary).
