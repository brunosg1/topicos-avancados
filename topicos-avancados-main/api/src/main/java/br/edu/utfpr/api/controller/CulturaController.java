package br.edu.utfpr.api.controller;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import br.edu.utfpr.api.dto.CulturaDTO;
import br.edu.utfpr.api.model.Cultura;
import br.edu.utfpr.api.repository.CulturaRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@Validated
@SecurityRequirement(name = "Authorization")
@Tag(name = "Cultura", description = "Culturas como soja, milho, dentre outras")
@RestController
@RequestMapping(value = "/culturas", produces = "application/json")
public class CulturaController {

    @Autowired
    private CulturaRepository culturaRepository;

    @Operation(summary = "Obtem culturas", description = "Obtem todas as culturas cadastradas")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Culturas obtidas com sucesso"),
        @ApiResponse(responseCode = "500", description = "Erro interno do servidor")
    })
    @GetMapping({ "" })
    public ResponseEntity<List<Cultura>> getAll() {
        List<Cultura> culturas = culturaRepository.findAll();
        return ResponseEntity.ok(culturas);
    }

    @Operation(summary = "Obter por id", description = "Obtem uma cultura pelo ID")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Cultura encontrada"),
        @ApiResponse(responseCode = "404", description = "Cultura não encontrada"),
        @ApiResponse(responseCode = "500", description = "Erro interno do servidor")
    })
    @GetMapping("/{id}")
    public ResponseEntity<List<Cultura>> getById(@Parameter(required = true) @PathVariable Long id) {
        List<Cultura> culturas = culturaRepository.findById(id)
                .map(cultura -> List.of(cultura))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cultura não encontrada"));

        return ResponseEntity.ok(culturas);
    }

    @Operation(summary = "Salvar Cultura", description = "Salva uma cultura no banco de dados")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "201", description = "Cultura criada com sucesso"),
        @ApiResponse(responseCode = "400", description = "Dados de entrada inválidos"),
        @ApiResponse(responseCode = "500", description = "Erro interno do servidor")
    })
    @PostMapping({ "" })
    public ResponseEntity<Cultura> post(@Valid @RequestBody CulturaDTO p, BindingResult bindingResult) {
        System.out.println("CulturaDTO recebido: " + p.nome);
        var cultura = new Cultura();
        cultura.setNome(p.nome);
        cultura.setTempoCultivoDias(p.tempoCultivoDias);
        cultura.setEpocaPlantio(p.epocaPlantio);
        cultura.setCreationDate(LocalDateTime.now());

        Cultura salva = culturaRepository.save(cultura);
        return ResponseEntity.status(HttpStatus.CREATED).body(salva);
    }

    @Operation(summary = "Editar cultura", description = "Edita ou altera uma cultura no banco de dados")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Cultura atualizada com sucesso"),
        @ApiResponse(responseCode = "404", description = "Cultura não encontrada"),
        @ApiResponse(responseCode = "400", description = "Dados inválidos"),
        @ApiResponse(responseCode = "500", description = "Erro interno do servidor")
    })
    @PutMapping({ "" })
    public ResponseEntity<Cultura> put(@RequestBody @Parameter(required = true) @Valid Cultura cultura) {
        Cultura existente = culturaRepository.findById(cultura.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cultura não encontrada"));

        existente.setNome(cultura.getNome());
        existente.setTempoCultivoDias(cultura.getTempoCultivoDias());
        existente.setEpocaPlantio(cultura.getEpocaPlantio());
        existente.setUpdateDate(LocalDateTime.now());

        Cultura atualizada = culturaRepository.save(existente);
        return ResponseEntity.ok(atualizada);
    }

    @Operation(summary = "Deleta cultura", description = "Deleta uma cultura no banco de dados")
    @ApiResponses(value = {
        @ApiResponse(responseCode = "200", description = "Cultura deletada com sucesso"),
        @ApiResponse(responseCode = "404", description = "Cultura não encontrada"),
        @ApiResponse(responseCode = "500", description = "Erro interno do servidor")
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable @Parameter(required = true) @Valid long id) {
        Cultura cultura = culturaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Cultura não encontrada"));

        culturaRepository.delete(cultura);

        Map<String, Object> resposta = new HashMap<>();
        resposta.put("status", 200);
        resposta.put("mensagem", "Cultura deletada com sucesso");

        return ResponseEntity.ok(resposta);
    }
}
