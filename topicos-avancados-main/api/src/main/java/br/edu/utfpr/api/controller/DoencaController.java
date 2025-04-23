package br.edu.utfpr.api.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import br.edu.utfpr.api.dto.DoencaDTO;
import br.edu.utfpr.api.model.Cultura;
import br.edu.utfpr.api.model.Doenca;
import br.edu.utfpr.api.repository.CulturaRepository;
import br.edu.utfpr.api.repository.DoencaRepository;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping(value="/doencas", produces = "application/json")

public class DoencaController {
    @Autowired
    private DoencaRepository doencaRepository;

    @Autowired
    private CulturaRepository culturaRepository;

    @GetMapping({"", "/"})
    public List<Doenca> get(@RequestParam(required = false) String nome) {
        var doencas = doencaRepository.findAll();

        if (nome == null || nome.isEmpty()) {
            // Retorna todas as culturas se nome não for informado, pode retornar uma lista vazia
            return doencas;
        } else {
            List<Doenca> auxList = new ArrayList<>();
            for (Doenca doenca : doencas) {
                if (doenca.getNome().equalsIgnoreCase(nome)) {
                    auxList.add(doenca);
                }
            }
            if (auxList.isEmpty()){
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Cultura não encontrada");          
            }
            return auxList; //retorna lista com respostas
        }
    }
    @PutMapping({"", "/"})
    public Doenca put(@RequestBody Cultura doenca) {
        Optional<Doenca> doencaExistente = doencaRepository.findById(doenca.getId());

        if (doencaExistente.isPresent()) {
            Doenca atualizada = doencaExistente.get();
            atualizada.setNome(doenca.getNome());

            return doencaRepository.save(atualizada); 
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Doenca não encontrada");
        }
    }

    @PostMapping({"", "/"})
    public Doenca post(@RequestBody DoencaDTO p) {
        var culturas = new ArrayList<Cultura>();

        for (Long id : p.culturasAfetadas) {
            Cultura cultura = culturaRepository.findById(id).get();
            culturas.add(cultura);
        }

        if(culturas.isEmpty()){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Culturas não encontradas");
        }

        var doenca = new Doenca();
        doenca.setNome(p.nome);
        doenca.setSintomas(p.sintomas);
        doenca.setCulturasAfetadas(culturas);
        doenca.setTratamentos(p.tratamentos);

        return doencaRepository.save(doenca);
    }

    @DeleteMapping({"", "/"})
    public ResponseEntity<Map<String, Object>> delete(@RequestParam long id) {
        Optional<Doenca> doenca = doencaRepository.findById(id);

        if (doenca.isPresent()) {
            doencaRepository.delete(doenca.get());

            Map<String, Object> resposta = new HashMap<>();
            resposta.put("status", 200);
            resposta.put("mensagem", "Doença erradicada com sucesso");

            return ResponseEntity.ok(resposta);
        } else {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Doença não encontrada");
        }
    }
}
