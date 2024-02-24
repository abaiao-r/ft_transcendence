listener "tcp" {
  address          = "0.0.0.0:8201"
  tls_disable      = "true"
}

storage "file" {
  path  = "/vault/data"
}

api_addr = "http://0.0.0.0:8200"
