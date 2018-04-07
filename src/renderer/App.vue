<template>
  <div id="app">
    <v-app dark>
      <v-card-title>
      <v-dialog v-model="dialog" max-width="500px">
      <v-btn color="primary" dark slot="activator" class="mb-2">New Contact</v-btn>
      <v-form v-model="valid" ref="form" lazy-validation>
      <v-card>
        <v-card-title>
          <span class="headline">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6 md4>
                <v-text-field name="name" label="Name" v-model="editedPerson.name" :rules="nameRules" :counter="20" id="name"required></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field label="Address" v-model="editedPerson.address"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field label="Mobile No" v-model="editedPerson.mobileno" :rules="mobileRules" :counter="11"required></v-text-field>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click.native="close">Cancel</v-btn>
          <v-btn color="blue darken-1" flat @click.native="save" :disabled="!valid">Save</v-btn>
        </v-card-actions>
      </v-card>
      </v-form>
    </v-dialog>
       
      <v-spacer></v-spacer>
      <v-text-field
        append-icon="search"
        label="Search"
        single-line
        hide-details
        v-model="search"
      ></v-text-field>
    </v-card-title>
     <v-data-table
     v-model="selected"
    :headers="headers"
    :items="persons"
    select-all
    :pagination.sync="pagination"
    item-key="name"
    :loading="false"
    :search="search"
    class="elevation-1"
  >

  <template slot="headers" slot-scope="props">
      <tr>
        <th class="text-xs-left"> 
          <v-checkbox
            primary
            hide-details
            @click.native="toggleAll"
            :input-value="props.all"
            :indeterminate="props.indeterminate"
          ></v-checkbox>
        </th>
        <th class="text-xs-left"
          v-for="header in props.headers"
          :key="header.text"
          :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
          @click="changeSort(header.value)"
        >
          <v-icon small>arrow_upward</v-icon>
          {{ header.text }}
        </th>
      </tr>
    </template>
 <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
  <template slot="items" slot-scope="props">
      <tr :active="props.selected" @click="props.selected = !props.selected">
        <td class="text-xs-left">
          <v-checkbox
            primary
            hide-details
            :input-value="props.selected"
          ></v-checkbox>
        </td>
      <td class="text-xs-left">{{ props.item.id }}</td>
      <td class="text-xs-left">{{ props.item.name }}</td>
      <td class="text-xs-left">{{ props.item.address }}</td>
      <td class="text-xs-left">{{ props.item.mobileno }}</td>
      <td class="justify-left layout px-0">
          <v-btn icon class="mx-0" @click="editPerson(props.item)">
            <v-icon color="teal">edit</v-icon>
          </v-btn>
          <v-btn icon class="mx-0" @click="deletePerson(props.item)">
            <v-icon color="pink">delete</v-icon>
          </v-btn>
        </td>
    </tr>
    </template>

    <template slot="no-data">
      <v-alert :value="true" color="error" icon="warning">
        Sorry, nothing to display here
      </v-alert>
    </template>
     <v-alert slot="no-results" :value="true" color="error" icon="warning">
        Your search for "{{ search }}" found no results.
      </v-alert>
    </v-data-table>
      <v-footer :fixed="fixed" app>
        <v-spacer></v-spacer>
        <span>Md. Liton Miah&copy; 2018</span>
      </v-footer>
    </v-app>
  </div>
</template>

<script>
import personsRepository from '../repositories/personsRepository'
  export default {
    name: 'contact-persons',
    data () {
      return {
      valid: true,
      nameRules: [
        v => !!v || 'Name is required',
        v => (v && v.length <= 20) || 'Name must be less than 20 characters'
      ],
      mobileRules: [
      v=> !!v || 'Mobile No is required',
      v=> (v && v.length == 11 || 'Mobile No must be 11 digits')
      ],
      search: '',
      pagination: {
      sortBy: 'name'
      },
      selected: [],
      dialog: false,
      editedIndex: -1,
      editedPerson: {
        id: '',
        name: '',
        address: '',
        mobileno: ''
      },
      defaultPerson: {
        name: '',
        address: '',
        mobileno: ''
      },
      }
    },
    computed: {
      rules () {
        return this.$store.state.nameRules;
      },
      formTitle () {
        return this.editedIndex === -1 ? 'New Person' : 'Edit Person'
      },
      headers () {
        return this.$store.state.headers;
      },
      persons () {
        return this.$store.state.persons;
      },
      selected () {
        return this.$store.state.selected;
      },
      pagination () {
        return this.$store.state.pagination;
      }
    },
    watch: {
      dialog (val) {
        val || this.close()
      }
    },
    created () {
      this.initialize()
    },
    methods: {
      initialize () {
        return this.$store.state.persons = personsRepository.getPersons();
      },
      editPerson (item) {
        this.editedIndex = this.$store.state.persons.indexOf(item)
        this.editedPerson = Object.assign({}, item)
        this.dialog = true
      },
      deletePerson (item) {
        const index = this.$store.state.persons.indexOf(item)
        confirm('Are you sure you want to delete this contact?') && this.$store.state.persons.splice(index, 1)
        personsRepository.removePerson(item.id)
      },
      close () {
        this.dialog = false
        setTimeout(() => {
          this.editedPerson = Object.assign({}, this.defaultPerson)
          this.editedIndex = -1
        }, 300)
      },
      save () {
         var value = this.editedPerson.name.trim() && this.editedPerson.mobileno.trim()
       if (!value) {
        if (!this.editedPerson.name) {
          this.editedPerson.name = '' 
        }
        if (!this.editedPerson.mobileno) {
          this.editedPerson.mobileno = ''
        }
        return
      } 
        if (this.editedIndex > -1) {
          Object.assign(this.$store.state.persons[this.editedIndex], this.editedPerson)
          personsRepository.updatePerson(this.editedPerson.id, this.editedPerson.name, this.editedPerson.address, this.editedPerson.mobileno)
          this.initialize()
        } else {
          personsRepository.addPersonToEnd(this.editedPerson.name, this.editedPerson.address, this.editedPerson.mobileno)
          this.initialize()
        }
        this.close()
      },
    
      toggleAll () {
        if (this.selected.length) this.selected = []
        else this.selected = this.$store.state.persons.slice()
      },
    changeSort (column) {
        if (this.pagination.sortBy === column) {
          this.pagination.descending = !this.pagination.descending
        } else {
          this.pagination.sortBy = column
          this.pagination.descending = false
        }
      }
    }
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons');
  /* Global CSS */
</style>
