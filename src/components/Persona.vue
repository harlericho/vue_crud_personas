<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-sm-3">
        <div class="card border-success mb-3" style="max-width: 30rem">
          <div
            class="card-header bg-transparent border-success"
            id="headerCard1"
          >
            Personas
          </div>
          <div class="card-body text-success">
            <h5 class="card-title">Formulario</h5>
            <form v-on:submit.prevent="crearData()">
              <input type="hidden" v-model="persona.id" />
              <div class="mb-3">
                <label for="dni" class="form-label">Dni</label>
                <input
                  type="text"
                  maxlength="10"
                  class="form-control"
                  v-model="persona.dni"
                  ref="dni"
                  autofocus
                />
              </div>
              <div class="mb-3">
                <label for="nombres" class="form-label">Nombres</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="persona.nombres"
                  ref="nombres"
                />
              </div>
              <div class="mb-3">
                <label for="exampleInputEmail1" class="form-label"
                  >Correo</label
                >
                <input
                  type="email"
                  class="form-control"
                  v-model="persona.correo"
                  ref="correo"
                  aria-describedby="emailHelp"
                />
              </div>
              <div class="mb-3">
                <label for="edad" class="form-label">Edad</label>
                <input
                  type="number"
                  class="form-control"
                  v-model="persona.edad"
                  min="18"
                  max="99"
                  required
                />
              </div>
              <button type="submit" class="btn btn-primary" id="margen">
                Guardar
              </button>
              <button
                type="button"
                class="btn btn-info"
                v-on:click="crearNuevo()"
              >
                Nuevo
              </button>
            </form>
          </div>
          <div
            class="card-footer bg-transparent border-success"
            id="footerCard1"
          >
            @charlie
          </div>
        </div>
      </div>
      <div class="col-sm-9">
        <div class="card border-danger mb-3" style="max-width: 50rem">
          <div
            class="card-header bg-transparent border-danger"
            id="headerCard2"
          >
            Personas
          </div>
          <div class="card-body text-danger">
            <h5 class="card-title">Listado</h5>
            <div class="table table-responsive">
              <table class="table table-striped">
                <thead>
                  <tr id="cabezeraTable">
                    <th>#</th>
                    <th>Dni</th>
                    <th>Nombres</th>
                    <th>Correo</th>
                    <th>Edad</th>
                    <th colspan="2">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(listar, i) in listado" :key="listar.id">
                    <td scope="row">{{ i + 1 }}</td>
                    <td>{{ listar.dni }}</td>
                    <td>{{ listar.nombres }}</td>
                    <td>{{ listar.correo }}</td>
                    <td>{{ listar.edad }}</td>
                    <td>
                      <button
                        type="button"
                        class="btn btn-primary"
                        v-on:click="obtenerData(listar.id)"
                      >
                        Editar
                      </button>
                    </td>
                    <td>
                      <button
                        type="button"
                        class="btn btn-danger"
                        v-on:click="eliminarData(listar.id)"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div
            class="card-footer bg-transparent border-danger"
            id="footerCard2"
          >
            @charlie
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const url = "http://localhost:2000/";
import axios from "axios";
import Swal from "sweetalert2";
export default {
  data() {
    return {
      persona: {
        id: "",
        dni: "",
        nombres: "",
        correo: "",
        edad: "",
      },
      listado: [],
    };
  },
  mounted() {
    this.listadoData();
  },
  methods: {
    soloNumeros(dni) {
      var c = 0;
      for (let index = 0; index < dni.length; index++) {
        if (dni[index] >= 0 && dni[index] <= 9) {
          c = c + 1;
        } else {
          c = c - 1;
        }
      }
      if (c === dni.length) {
        return true;
      } else {
        return false;
      }
    },
    listadoData() {
      axios
        .get(url)
        .then((res) => {
          this.listado = res.data.personas;
        })
        .catch((err) => {
          console.error(err);
        });
    },
    crearData() {
      const params = {
        dni: this.persona.dni,
        nombres: this.persona.nombres,
        correo: this.persona.correo,
        edad: this.persona.edad,
      };
      if (this.soloNumeros(this.persona.dni)) {
        if (this.persona.id === "") {
          this.guardarData(params);
        } else {
          this.actualizarData(params, this.persona.id);
        }
      } else {
        this.$toast.warning("Dni solo debe tener numeros del 0 - 9", {
          position: "top-right",
          duration: 2000,
        });
        this.$refs.dni.focus();
      }
    },
    guardarData(params) {
      axios
        .post(url, params)
        .then(() => {
          this.$toast.success("Dato guardado correctamente..!", {
            position: "top-right",
            duration: 2000,
          });
          this.listadoData();
          this.crearNuevo();
        })
        .catch((err) => {
          if (err.response.status == 422) {
            if (err.response.data.mensaje[0]["param"] === "dni") {
              this.$toast.error(err.response.data.mensaje[0]["msg"], {
                position: "top-right",
                duration: 2000,
              });
              this.$refs.dni.focus();
            } else if (err.response.data.mensaje[0]["param"] === "correo") {
              this.$toast.error(err.response.data.mensaje[0]["msg"], {
                position: "top-right",
                duration: 2000,
              });
              this.$refs.correo.focus();
            } else if (err.response.data.mensaje[0]["param"] === "nombres") {
              this.$toast.error(err.response.data.mensaje[0]["msg"], {
                position: "top-right",
                duration: 2000,
              });
              this.$refs.nombres.focus();
            }
          }
        });
    },
    actualizarData(params, id) {
      axios
        .put(url + id, params)
        .then(() => {
          this.$toast.success("Dato actualizado correctamente..!", {
            position: "top-right",
            duration: 2000,
          });
          this.listadoData();
          this.crearNuevo();
        })
        .catch((err) => {
          if (err.response.status == 422) {
            if (err.response.data.mensaje[0]["param"] === "dni") {
              this.$toast.error(err.response.data.mensaje[0]["msg"], {
                position: "top-right",
                duration: 2000,
              });
              this.$refs.dni.focus();
            } else if (err.response.data.mensaje[0]["param"] === "correo") {
              this.$toast.error(err.response.data.mensaje[0]["msg"], {
                position: "top-right",
                duration: 2000,
              });
              this.$refs.correo.focus();
            } else if (err.response.data.mensaje[0]["param"] === "nombres") {
              this.$toast.error(err.response.data.mensaje[0]["msg"], {
                position: "top-right",
                duration: 2000,
              });
              this.$refs.nombres.focus();
            }
          }
        });
    },
    eliminarData(id) {
      Swal.fire({
        title: "Estás seguro?",
        text: "No podrás revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, eliminarlo!",
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire("Eliminado!", "Su archivo ha sido eliminado", "success");
          axios
            .delete(url + id)
            .then(() => {
              this.$toast.success("Dato eliminado correctamente..!", {
                position: "top-right",
                duration: 2000,
              });
              this.listadoData();
            })
            .catch((err) => {
              console.error(err);
            });
        }
      });
    },
    obtenerData(id) {
      this.$toast.info("Usted va realizar una actualización..!", {
        position: "top-right",
        duration: 2000,
      });
      axios
        .get(url + id)
        .then((res) => {
          this.persona.id = res.data.personas[0].id;
          this.persona.dni = res.data.personas[0].dni;
          this.persona.nombres = res.data.personas[0].nombres;
          this.persona.correo = res.data.personas[0].correo;
          this.persona.edad = res.data.personas[0].edad;
          this.$refs.dni.focus();
        })
        .catch((err) => {
          console.error(err);
        });
    },
    crearNuevo() {
      this.persona.id = "";
      this.persona.dni = "";
      this.persona.nombres = "";
      this.persona.correo = "";
      this.persona.edad = "";
      this.$refs.dni.focus();
    },
  },
};
</script>
<style>
.table {
  text-align: center;
}
#headerCard1 {
  color: darkgreen;
}
#footerCard1 {
  color: darkgreen;
}
#headerCard2 {
  color: crimson;
}
#footerCard2 {
  color: crimson;
}
#cabezeraTable {
  color: crimson;
}
#margen {
  margin-right: 5%;
}
</style>