package br.edu.utfpr.api.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import br.edu.utfpr.api.dto.CulturaDTO;
import br.edu.utfpr.api.model.Cultura;
import br.edu.utfpr.api.repository.CulturaRepository;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.PutMapping;


@RestController
@RequestMapping(value="/culturas", produces = "application/json")
public class CulturaController {

    @Autowired
    private CulturaRepository culturaRepository;

    @GetMapping({"", "/"})
    public ResponseEntity<List<Cultura>> get(@RequestParam(required = false) String nome) {
        List<Cultura> culturas;

        if (nome == null || nome.isEmpty()) {
            culturas = culturaRepository.findAll();
        } else {
            culturas = culturaRepository.findAll().stream()
                .filter(c -> c.getNome().equalsIgnoreCase(nome))
                .toList();
        }

        if (culturas.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Cultura não encontrada");
        }

        return ResponseEntity.ok(culturas);
    }

    @PostMapping({"", "/"})
    public ResponseEntity<Cultura> post(@RequestBody CulturaDTO p) {
        var cultura = new Cultura();
        cultura.setNome(p.nome);
        cultura.setTempoCultivoDias(p.tempoCultivoDias);
        cultura.setEpocaPlantio(p.epocaPlantio);
        cultura.setCreationDate(LocalDateTime.now());

        Cultura salva = culturaRepository.save(cultura);
        return ResponseEntity.status(HttpStatus.CREATED).body(salva);
    }

    @PutMapping({"", "/"})
    public ResponseEntity<Cultura> put(@RequestBody Cultura cultura) {
        Cultura existente = culturaRepository.findById(cultura.getId())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cultura não encontrada"));

        existente.setNome(cultura.getNome());
        existente.setTempoCultivoDias(cultura.getTempoCultivoDias());
        existente.setEpocaPlantio(cultura.getEpocaPlantio());
        existente.setUpdateDate(LocalDateTime.now());

        Cultura atualizada = culturaRepository.save(existente);
        return ResponseEntity.ok(atualizada);
    }

    @DeleteMapping({"", "/"})
    public ResponseEntity<Map<String, Object>> delete(@RequestParam long id) {
        Cultura cultura = culturaRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cultura não encontrada"));

        culturaRepository.delete(cultura);

        Map<String, Object> resposta = new HashMap<>();
        resposta.put("status", 200);
        resposta.put("mensagem", "Cultura deletada com sucesso");

        return ResponseEntity.ok(resposta);
    }
}
