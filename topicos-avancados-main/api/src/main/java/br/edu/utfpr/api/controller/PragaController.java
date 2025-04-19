package br.edu.utfpr.api.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.edu.utfpr.api.model.Praga;
import br.edu.utfpr.api.repository.PragaRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping(value="/pragas", produces = "application/json")

public class PragaController {
    @Autowired
    private PragaRepository pragaRepository;

    // @GetMapping("/1")
    // public Culturas getOne(){
    //     var p = new Culturas(1, "Pedro", "Henrique", "pedro@utfpr.com.br");

    //     return p;
    // }

    @PostMapping({"", "/"})
    public Praga create(@RequestBody Praga p){
        return pragaRepository.save(p);
    }
}
