# andasy.hcl app configuration file generated for my-002 on Tuesday, 10-Mar-26 15:29:57 SAST
#
# See https://github.com/quarksgroup/andasy-cli for information about how to use this file.

app_name = "my-002"

app {

  env = {}

  port = 3000

  primary_region = "fsn"

  compute {
    cpu      = 1
    memory   = 256
    cpu_kind = "shared"
  }

  process {
    name = "my-002"
  }

}
