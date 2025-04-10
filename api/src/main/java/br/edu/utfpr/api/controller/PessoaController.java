package br.edu.utfpr.api.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.edu.utfpr.api.model.Pessoa;
import br.edu.utfpr.api.repository.PessoaRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping(value="/pessoa", produces = "application/json")

public class PessoaController {
    @Autowired
    private PessoaRepository pessoaRepository;

    @GetMapping("/1")
    public Pessoa getOne(){
        var p = new Pessoa(1, "Pedro", "Henrique", "pedro@utfpr.com.br");

        return p;
    }

    @PostMapping({"", "/"})
    public Pessoa create(@RequestBody Pessoa p){
        return pessoaRepository.save(p);
    }
}
